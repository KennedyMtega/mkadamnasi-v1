import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser, hashIp, getClientIp } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { castVoteSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rate-limit';

/**
 * POST /api/votes/[id]/cast - Cast a vote on a poll
 * Anonymous and one-vote-per-user enforced.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting: 30 requests per minute
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { success: rateLimitOk } = rateLimit(`cast-vote:${ip}`, 30, 60000);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: 'Maombi mengi sana. Tafadhali subiri.' },
        { status: 429 }
      );
    }

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
    const parsed = castVoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Taarifa si sahihi', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { optionId } = parsed.data;

    // Verify vote exists and is active
    const vote = await prisma.vote.findUnique({
      where: { id: voteId },
      include: { options: true },
    });

    if (!vote) {
      return NextResponse.json(
        { error: 'Kura haikupatikana.' },
        { status: 404 }
      );
    }

    if (!vote.isActive || vote.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Kura hii haiko hai tena.' },
        { status: 400 }
      );
    }

    if (vote.endDate && vote.endDate < new Date()) {
      return NextResponse.json(
        { error: 'Muda wa kura umekwisha.' },
        { status: 400 }
      );
    }

    // Verify option belongs to this vote
    const option = vote.options.find((o) => o.id === optionId);
    if (!option) {
      return NextResponse.json(
        { error: 'Chaguo haliko katika kura hii.' },
        { status: 400 }
      );
    }

    // Check if user already voted (enforce one vote per user)
    const existingEntry = await prisma.voteEntry.findUnique({
      where: { voteId_userId: { voteId, userId: user.id } },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Umeshapiga kura katika kura hii.' },
        { status: 409 }
      );
    }

    // Get fraud detection data
    const clientIp = getClientIp(request);
    const ipHash = hashIp(clientIp);
    const userAgent = request.headers.get('user-agent') || null;
    const deviceFingerprint = request.headers.get('x-device-fingerprint') || null;

    // Cast the vote in a transaction
    await prisma.$transaction([
      // Create vote entry
      prisma.voteEntry.create({
        data: {
          id: uuidv4(),
          voteId,
          optionId,
          userId: user.id,
          ipHash,
          deviceFingerprint,
          userAgent,
        },
      }),
      // Increment option vote count
      prisma.voteOption.update({
        where: { id: optionId },
        data: { voteCount: { increment: 1 } },
      }),
      // Increment total votes on the vote
      prisma.vote.update({
        where: { id: voteId },
        data: { totalVotes: { increment: 1 } },
      }),
      // Award points to user
      prisma.user.update({
        where: { id: user.id },
        data: { points: { increment: 2 } },
      }),
    ]);

    // Fetch updated vote with results
    const updatedVote = await prisma.vote.findUnique({
      where: { id: voteId },
      include: {
        options: { orderBy: { voteCount: 'desc' } },
      },
    });

    const options = updatedVote!.options.map((opt) => ({
      ...opt,
      percentage: updatedVote!.totalVotes > 0
        ? Math.round((opt.voteCount / updatedVote!.totalVotes) * 100)
        : 0,
    }));

    return NextResponse.json({
      data: {
        ...updatedVote,
        options,
        hasVoted: true,
        userVoteOptionId: optionId,
      },
      message: 'Kura yako imehesabiwa! Asante.',
    });
  } catch (error) {
    console.error('Error casting vote:', error);
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
