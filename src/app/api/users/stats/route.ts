import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';

/**
 * GET /api/users/stats - Get current user stats
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

    const [
      votesCast,
      ratingsGiven,
      votesCreated,
      ratingsCreated,
      badges,
      profile,
    ] = await Promise.all([
      prisma.voteEntry.count({ where: { userId: user.id } }),
      prisma.ratingEntry.count({ where: { userId: user.id } }),
      prisma.vote.count({ where: { creatorId: user.id } }),
      prisma.rating.count({ where: { creatorId: user.id } }),
      prisma.userBadge.findMany({
        where: { userId: user.id },
        include: { badge: true },
        orderBy: { earnedAt: 'desc' },
      }),
      prisma.user.findUnique({
        where: { id: user.id },
        select: {
          points: true,
          level: true,
          streak: true,
        },
      }),
    ]);

    // Calculate next level threshold (each level = 250 points)
    const currentLevel = profile?.level ?? 1;
    const nextLevelPoints = currentLevel * 250;

    return NextResponse.json({
      data: {
        votesCast,
        ratingsGiven,
        votesCreated,
        ratingsCreated,
        points: profile?.points ?? 0,
        level: currentLevel,
        nextLevelPoints,
        streak: profile?.streak ?? 0,
        badgesEarned: badges.length,
        badges: badges.map((ub) => ({
          id: ub.badge.id,
          name: ub.badge.name,
          nameEn: ub.badge.nameEn,
          icon: ub.badge.icon,
          description: ub.badge.description,
          earnedAt: ub.earnedAt,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
