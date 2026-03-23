import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { logger, getRequestContext } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateAnonymousUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unahitaji kuingia kwanza (Authentication required)' },
        { status: 401 }
      );
    }

    // Find approved business claim for this user
    const claim = await prisma.businessClaim.findFirst({
      where: {
        userId: user.id,
        status: 'APPROVED',
      },
      include: {
        business: true,
      },
    });

    if (!claim || !claim.business) {
      return NextResponse.json(
        { error: 'Huna biashara iliyothibitishwa (No verified business found)' },
        { status: 404 }
      );
    }

    const businessId = claim.business.id;

    // Fetch stats in parallel
    const [ratings, totalPolls, recentRatings] = await Promise.all([
      prisma.rating.findMany({
        where: { businessId },
        select: {
          averageRating: true,
          totalRatings: true,
          viewCount: true,
        },
      }),
      prisma.vote.count({
        where: { businessId },
      }),
      prisma.ratingEntry.findMany({
        where: {
          rating: { businessId },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          score: true,
          review: true,
          isAnonymous: true,
          createdAt: true,
        },
      }),
    ]);

    const totalRatings = ratings.reduce((sum, r) => sum + r.totalRatings, 0);
    const totalViews = ratings.reduce((sum, r) => sum + r.viewCount, 0);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.averageRating * r.totalRatings, 0) /
          (totalRatings || 1)
        : 0;

    return NextResponse.json({
      data: {
        totalRatings,
        averageRating: Math.round(averageRating * 10) / 10,
        totalPolls,
        totalViews,
        recentRatings,
      },
    });
  } catch (error) {
    logger.error('Business dashboard error:', { source: 'api/business/dashboard' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Hitilafu ya seva (Server error)' },
      { status: 500 }
    );
  }
}
