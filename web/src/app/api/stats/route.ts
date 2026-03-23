import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger, getRequestContext } from '@/lib/logger';

/**
 * GET /api/stats - Public platform statistics
 * Cache-friendly endpoint for homepage stats
 */
export async function GET() {
  try {
    const [totalUsers, totalVotes, totalRatings, totalVoteEntries] = await Promise.all([
      prisma.user.count(),
      prisma.vote.count({ where: { status: 'ACTIVE' } }),
      prisma.rating.count({ where: { status: 'ACTIVE' } }),
      prisma.voteEntry.count(),
    ]);

    return NextResponse.json(
      {
        data: {
          totalUsers,
          totalVotes,
          totalRatings,
          totalVoteEntries,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    logger.error('Error fetching stats:', { source: 'api/stats' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
