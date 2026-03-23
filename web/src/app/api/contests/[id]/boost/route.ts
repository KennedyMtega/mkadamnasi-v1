import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { boostVoteSchema } from '@/lib/validations';
import { logger, getRequestContext } from '@/lib/logger';

/**
 * POST /api/contests/[id]/boost - Purchase boost votes
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: voteId } = await params;
    const user = await getOrCreateAnonymousUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Kitambulisho cha siri kinahitajika.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Zod validation
    const parsed = boostVoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Taarifa si sahihi', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { optionId, amount, phoneNumber } = parsed.data;

    // Verify contest exists and boost is enabled
    const contest = await prisma.vote.findUnique({
      where: { id: voteId },
      select: {
        id: true,
        type: true,
        status: true,
        isActive: true,
        boostEnabled: true,
        boostPrice: true,
        endDate: true,
      },
    });

    if (!contest || contest.type !== 'CONTEST') {
      return NextResponse.json(
        { error: 'Shindano halipatikani. / Contest not found.' },
        { status: 404 }
      );
    }

    if (!contest.isActive || contest.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Shindano halipo hai. / Contest is not active.' },
        { status: 400 }
      );
    }

    if (contest.endDate && new Date(contest.endDate) < new Date()) {
      return NextResponse.json(
        { error: 'Shindano limekwisha. / Contest has ended.' },
        { status: 400 }
      );
    }

    if (!contest.boostEnabled) {
      return NextResponse.json(
        { error: 'Boost haijawezeshwa kwa shindano hili. / Boost is not enabled for this contest.' },
        { status: 400 }
      );
    }

    if (!contest.boostPrice) {
      return NextResponse.json(
        { error: 'Bei ya boost haijawekwa. / Boost price not set.' },
        { status: 400 }
      );
    }

    // Verify option belongs to this contest
    const option = await prisma.voteOption.findFirst({
      where: { id: optionId, voteId },
    });

    if (!option) {
      return NextResponse.json(
        { error: 'Mshiriki hapatikani katika shindano hili. / Contestant not found in this contest.' },
        { status: 400 }
      );
    }

    const unitPrice = contest.boostPrice;
    const totalPrice = Number(unitPrice) * amount;
    const paymentRef = `BST-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Create boost vote record with PENDING status
    const boostVote = await prisma.boostVote.create({
      data: {
        id: uuidv4(),
        voteId,
        optionId,
        userId: user.id,
        amount,
        unitPrice,
        totalPrice,
        paymentRef,
        phoneNumber,
        status: 'PENDING',
      },
      include: {
        option: {
          select: { title: true },
        },
      },
    });

    return NextResponse.json({
      data: {
        ...boostVote,
        paymentInstructions: {
          paymentRef,
          totalPrice,
          currency: 'TZS',
          phoneNumber,
          message: `Lipa TZS ${totalPrice.toLocaleString()} kwa M-Pesa. Tumia reference: ${paymentRef}`,
        },
      },
    }, { status: 201 });
  } catch (error) {
    logger.error('Error creating boost vote:', { source: 'api/contests/[id]/boost' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/contests/[id]/boost - Confirm boost payment (webhook/callback)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: voteId } = await params;
    const body = await request.json();
    const { paymentRef } = body as { paymentRef?: string };

    if (!paymentRef) {
      return NextResponse.json(
        { error: 'Taarifa si sahihi. paymentRef inahitajika.' },
        { status: 400 }
      );
    }

    // Find the boost vote by paymentRef
    const boostVote = await prisma.boostVote.findFirst({
      where: { paymentRef, voteId },
    });

    if (!boostVote) {
      return NextResponse.json(
        { error: 'Malipo hayapatikani. / Payment not found.' },
        { status: 404 }
      );
    }

    if (boostVote.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Malipo yameshakamilika. / Payment already completed.' },
        { status: 400 }
      );
    }

    // Confirm payment and increment vote counts atomically
    const result = await prisma.$transaction(async (tx) => {
      // Update boost vote status
      const updatedBoost = await tx.boostVote.update({
        where: { id: boostVote.id },
        data: { status: 'COMPLETED' },
      });

      // Increment option vote count by boost amount
      await tx.voteOption.update({
        where: { id: boostVote.optionId },
        data: { voteCount: { increment: boostVote.amount } },
      });

      // Increment total votes on contest
      await tx.vote.update({
        where: { id: voteId },
        data: { totalVotes: { increment: boostVote.amount } },
      });

      return updatedBoost;
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    logger.error('Error confirming boost payment:', { source: 'api/contests/[id]/boost' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
