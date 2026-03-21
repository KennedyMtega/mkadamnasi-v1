import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';

/**
 * GET /api/activity - Get user's activity feed
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateAnonymousUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Kitambulisho cha siri kinahitajika.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type'); // Optional filter: vote_cast, rating_given, badge_earned, etc.

    const where: Record<string, unknown> = { userId: user.id };
    if (type) where.type = type;

    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.activityLog.count({ where }),
    ]);

    // Also fetch unread notifications count
    const unreadNotifications = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });

    return NextResponse.json({
      data: activities,
      total,
      limit,
      offset,
      unreadNotifications,
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
