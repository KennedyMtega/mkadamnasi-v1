import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger, getRequestContext } from '@/lib/logger';

/**
 * GET /api/leaderboard - Top users by points
 * Accepts `period` query param: 'weekly' | 'all' (default: 'all')
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 50);

    const where: Record<string, unknown> = {
      isBanned: false,
    };

    if (period === 'weekly') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      where.lastActiveAt = { gte: oneWeekAgo };
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        anonymousId: true,
        points: true,
        level: true,
        _count: {
          select: {
            badges: true,
          },
        },
      },
      orderBy: { points: 'desc' },
      take: limit,
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      anonymousId: user.anonymousId.slice(0, 8) + '...',
      points: user.points,
      level: user.level,
      badgeCount: user._count.badges,
    }));

    return NextResponse.json(
      { data: leaderboard },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    logger.error('Error fetching leaderboard:', { source: 'api/leaderboard' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
