import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { logger, getRequestContext } from '@/lib/logger';

/**
 * GET /api/contests/[id] - Get contest detail with leaderboard
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getOrCreateAnonymousUser(request);

    const contest = await prisma.vote.findUnique({
      where: { id, type: 'CONTEST' },
      include: {
        options: {
          orderBy: { voteCount: 'desc' },
          include: {
            _count: {
              select: { boostVotes: { where: { status: 'COMPLETED' } } },
            },
          },
        },
        contestants: {
          orderBy: { option: { voteCount: 'desc' } },
          include: {
            option: {
              select: { voteCount: true },
            },
          },
        },
        category: true,
      },
    });

    if (!contest) {
      return NextResponse.json(
        { error: 'Shindano halipatikani. / Contest not found.' },
        { status: 404 }
      );
    }

    // Increment view count (non-blocking)
    prisma.vote.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    }).catch((err) => {
      logger.error('Failed to increment viewCount:', { source: 'api/contests/[id]' }, error instanceof Error ? error : new Error(String(error)));
    });

    // Check if current user has voted
    let hasVoted = false;
    let userVoteOptionId: string | null = null;
    if (user) {
      const existingEntry = await prisma.voteEntry.findUnique({
        where: { voteId_userId: { voteId: id, userId: user.id } },
      });
      if (existingEntry) {
        hasVoted = true;
        userVoteOptionId = existingEntry.optionId;
      }
    }

    // Calculate time remaining
    let timeRemaining: number | null = null;
    if (contest.endDate) {
      const remaining = new Date(contest.endDate).getTime() - Date.now();
      timeRemaining = remaining > 0 ? remaining : 0;
    }

    // Build leaderboard with percentages and boost counts
    const leaderboard = contest.contestants.map((contestant) => {
      const option = contest.options.find((o) => o.id === contestant.optionId);
      return {
        ...contestant,
        voteCount: option?.voteCount ?? 0,
        boostVoteCount: option?._count?.boostVotes ?? 0,
        percentage: contest.totalVotes > 0 && option
          ? Math.round((option.voteCount / contest.totalVotes) * 100)
          : 0,
      };
    });

    return NextResponse.json({
      data: {
        ...contest,
        options: contest.options.map((opt) => ({
          ...opt,
          percentage: contest.totalVotes > 0
            ? Math.round((opt.voteCount / contest.totalVotes) * 100)
            : 0,
          boostVoteCount: opt._count?.boostVotes ?? 0,
        })),
        leaderboard,
        timeRemaining,
        hasVoted,
        userVoteOptionId,
      },
    });
  } catch (error) {
    logger.error('Error fetching contest:', { source: 'api/contests/[id]' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
