import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger, getRequestContext } from '@/lib/logger';

/**
 * GET /api/votes/[id] - Get a single vote with options and results
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const vote = await prisma.vote.findUnique({
      where: { id },
      include: {
        options: {
          orderBy: { voteCount: 'desc' },
        },
        category: true,
      },
    });

    if (!vote) {
      return NextResponse.json(
        { error: 'Kura haikupatikana.' },
        { status: 404 }
      );
    }

    // For private polls, validate invite code (unless it's the creator)
    const { searchParams } = new URL(request.url);
    const inviteCodeParam = searchParams.get('code');
    // We'll check creator status later - for now just validate if code is needed

    // Increment view count
    await prisma.vote.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    // Calculate percentages
    const options = vote.options.map((opt) => ({
      ...opt,
      percentage: vote.totalVotes > 0
        ? Math.round((opt.voteCount / vote.totalVotes) * 100)
        : 0,
    }));

    // Calculate time left
    let timeLeft: string | null = null;
    if (vote.endDate) {
      const now = new Date();
      const diff = vote.endDate.getTime() - now.getTime();
      if (diff <= 0) {
        timeLeft = 'Imekwisha';
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days > 0) {
          timeLeft = `Siku ${days} zimebaki`;
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          timeLeft = `Saa ${hours} zimebaki`;
        }
      }
    }

    // Check if anonymous user has already voted
    const anonymousId = request.headers.get('x-anonymous-id');
    let hasVoted = false;
    let userVoteOptionId: string | null = null;
    let isCreator = false;

    if (anonymousId) {
      const { createHash } = await import('crypto');
      const hashedAnonId = createHash('sha256').update(anonymousId).digest('hex');
      const user = await prisma.user.findUnique({
        where: { anonymousId: hashedAnonId },
      });

      if (user) {
        isCreator = user.id === vote.creatorId;
        const existingEntry = await prisma.voteEntry.findUnique({
          where: { voteId_userId: { voteId: id, userId: user.id } },
        });
        if (existingEntry) {
          hasVoted = true;
          userVoteOptionId = existingEntry.optionId;
        }
      }
    }

    // For private polls, check access
    if (!vote.isPublic && !isCreator) {
      if (!inviteCodeParam) {
        return NextResponse.json(
          { error: 'Kura hii ni ya faragha. Unahitaji msimbo wa mwaliko.', requiresInvite: true },
          { status: 403 }
        );
      }
      const validInvite = await prisma.pollInvite.findFirst({
        where: { voteId: id, inviteCode: inviteCodeParam, isActive: true },
      });
      if (!validInvite) {
        return NextResponse.json(
          { error: 'Msimbo wa mwaliko si sahihi.', requiresInvite: true },
          { status: 403 }
        );
      }
      // Increment usage count
      await prisma.pollInvite.update({
        where: { id: validInvite.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Get invite code if private poll and user is creator
    let inviteCode: string | null = null;
    if (!vote.isPublic && isCreator) {
      const invite = await prisma.pollInvite.findFirst({
        where: { voteId: id, isActive: true },
      });
      inviteCode = invite?.inviteCode || null;
    }

    return NextResponse.json({
      data: {
        ...vote,
        options,
        timeLeft,
        hasVoted,
        userVoteOptionId,
        inviteCode,
        isCreator,
      },
    });
  } catch (error) {
    logger.error('Error fetching vote:', { source: 'api/votes/[id]' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
