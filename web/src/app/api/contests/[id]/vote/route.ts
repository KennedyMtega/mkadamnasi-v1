import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser, hashIp, getClientIp } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { rateLimit } from '@/lib/rate-limit';
import { checkAndAwardBadges } from '@/lib/badges';
import { logger, getRequestContext } from '@/lib/logger';

/**
 * POST /api/contests/[id]/vote - Vote for a contestant
 * Accepts: { optionId?: string, code?: string }
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

    // Rate limit: 30 requests per minute
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(`contest-vote:${user.id}`, 30, 60000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Unapiga kura haraka sana. Subiri kidogo. / Too many requests.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { optionId: rawOptionId, code } = body as { optionId?: string; code?: string };

    if (!rawOptionId && !code) {
      return NextResponse.json(
        { error: 'Taarifa si sahihi. Tuma optionId au code.' },
        { status: 400 }
      );
    }

    // Verify contest exists and is active
    const contest = await prisma.vote.findUnique({
      where: { id: voteId },
      select: {
        id: true,
        type: true,
        status: true,
        isActive: true,
        endDate: true,
        totalVotes: true,
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

    // Resolve optionId from code if needed
    let optionId = rawOptionId;
    if (code && !optionId) {
      const contestant = await prisma.contestant.findUnique({
        where: { voteId_code: { voteId, code: code.toUpperCase() } },
        select: { optionId: true, isApproved: true },
      });

      if (!contestant) {
        return NextResponse.json(
          { error: 'Mshiriki hapatikani kwa code hiyo. / Contestant not found.' },
          { status: 404 }
        );
      }

      if (!contestant.isApproved) {
        return NextResponse.json(
          { error: 'Mshiriki hajaidhinishwa bado. / Contestant not yet approved.' },
          { status: 400 }
        );
      }

      optionId = contestant.optionId;
    }

    // Verify option belongs to this contest
    const option = await prisma.voteOption.findFirst({
      where: { id: optionId, voteId },
    });

    if (!option) {
      return NextResponse.json(
        { error: 'Chaguo halipo katika shindano hili. / Option not found in this contest.' },
        { status: 400 }
      );
    }

    // Fraud detection data
    const ipHash = hashIp(clientIp);
    const deviceFingerprint = request.headers.get('x-device-fingerprint') || null;
    const userAgent = request.headers.get('user-agent') || null;

    // Create vote entry and increment counts atomically
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Create the vote entry (will fail if user already voted - unique constraint)
        await tx.voteEntry.create({
          data: {
            id: uuidv4(),
            voteId,
            optionId: optionId!,
            userId: user.id,
            ipHash,
            deviceFingerprint,
            userAgent,
          },
        });

        // Increment option vote count
        await tx.voteOption.update({
          where: { id: optionId! },
          data: { voteCount: { increment: 1 } },
        });

        // Increment total votes on contest
        await tx.vote.update({
          where: { id: voteId },
          data: { totalVotes: { increment: 1 } },
        });

        // Award 2 points to voter
        await tx.user.update({
          where: { id: user.id },
          data: { points: { increment: 2 } },
        });

        // Return updated contest with results
        return tx.vote.findUnique({
          where: { id: voteId },
          include: {
            options: {
              orderBy: { voteCount: 'desc' },
            },
            contestants: {
              select: {
                id: true,
                code: true,
                fullName: true,
                photoUrl: true,
                optionId: true,
              },
            },
          },
        });
      });

      // Check and award badges (non-blocking)
      const newBadges = await checkAndAwardBadges(user.id, prisma).catch((err) => {
        logger.error('Failed to check badges:', { source: 'api/contests/[id]/vote' }, error instanceof Error ? error : new Error(String(error)));
        return [] as string[];
      });

      // Enrich with percentages
      const enrichedResult = result ? {
        ...result,
        options: result.options.map((opt) => ({
          ...opt,
          percentage: result.totalVotes > 0
            ? Math.round((opt.voteCount / result.totalVotes) * 100)
            : 0,
        })),
      } : null;

      return NextResponse.json({ data: enrichedResult, newBadges }, { status: 201 });
    } catch (err: unknown) {
      // Handle unique constraint violation (user already voted)
      if (
        err &&
        typeof err === 'object' &&
        'code' in err &&
        (err as { code: string }).code === 'P2002'
      ) {
        return NextResponse.json(
          { error: 'Umeshapiga kura katika shindano hili. / You have already voted in this contest.' },
          { status: 409 }
        );
      }
      throw err;
    }
  } catch (error) {
    logger.error('Error voting in contest:', { source: 'api/contests/[id]/vote' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
