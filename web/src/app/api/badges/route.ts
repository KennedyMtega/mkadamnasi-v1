import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { BADGE_DEFINITIONS } from '@/lib/badges';
import { logger, getRequestContext } from '@/lib/logger';

/**
 * GET /api/badges - Return all badges with user's earned status and progress
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

    // Fetch all badges and user's earned badges in parallel
    const [allBadges, userBadges, votesCast, ratingsGiven, votesCreated, ratingsCreated, profile, referralCount] = await Promise.all([
      prisma.badge.findMany({
        where: { isActive: true },
        orderBy: [{ category: 'asc' }, { targetValue: 'asc' }],
      }),
      prisma.userBadge.findMany({
        where: { userId: user.id },
        select: { badgeId: true, earnedAt: true },
      }),
      prisma.voteEntry.count({ where: { userId: user.id } }),
      prisma.ratingEntry.count({ where: { userId: user.id } }),
      prisma.vote.count({ where: { creatorId: user.id } }),
      prisma.rating.count({ where: { creatorId: user.id } }),
      prisma.user.findUnique({
        where: { id: user.id },
        select: { streak: true },
      }),
      prisma.referral.count({ where: { referrerId: user.id } }),
    ]);

    const earnedMap = new Map(userBadges.map((ub) => [ub.badgeId, ub.earnedAt]));
    const creationsCount = votesCreated + ratingsCreated;
    const streak = profile?.streak ?? 0;

    // Build progress map for each badge slug
    const progressMap: Record<string, number> = {};
    for (const def of BADGE_DEFINITIONS) {
      switch (def.slug) {
        case 'first-vote':
        case 'voter-10':
        case 'voter-50':
        case 'voter-100':
          progressMap[def.slug] = votesCast;
          break;
        case 'first-rating':
        case 'rater-10':
        case 'rater-50':
          progressMap[def.slug] = ratingsGiven;
          break;
        case 'first-creation':
        case 'creator-10':
          progressMap[def.slug] = creationsCount;
          break;
        case 'streak-7':
        case 'streak-30':
          progressMap[def.slug] = streak;
          break;
        case 'first-referral':
        case 'referrer-10':
          progressMap[def.slug] = referralCount;
          break;
        case 'early-adopter':
          progressMap[def.slug] = 0;
          break;
        default:
          progressMap[def.slug] = 0;
      }
    }

    const badges = allBadges.map((badge) => {
      const earnedAt = earnedMap.get(badge.id);
      const isEarned = !!earnedAt;
      const currentProgress = progressMap[badge.slug] ?? 0;

      return {
        id: badge.id,
        slug: badge.slug,
        name: badge.name,
        nameEn: badge.nameEn,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        requirement: badge.requirement,
        targetValue: badge.targetValue,
        pointsReward: badge.pointsReward,
        isEarned,
        earnedAt: earnedAt ?? null,
        currentProgress: isEarned ? badge.targetValue : Math.min(currentProgress, badge.targetValue),
      };
    });

    const earnedCount = badges.filter((b) => b.isEarned).length;

    return NextResponse.json({
      data: {
        badges,
        totalBadges: badges.length,
        earnedCount,
      },
    });
  } catch (error) {
    logger.error('Error fetching badges:', { source: 'api/badges' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
