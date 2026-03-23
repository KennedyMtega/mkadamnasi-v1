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

    // Parse pagination params
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Get ratings for this business
    const ratings = await prisma.rating.findMany({
      where: { businessId },
      select: { id: true },
    });

    const ratingIds = ratings.map((r) => r.id);

    if (ratingIds.length === 0) {
      return NextResponse.json({
        data: [],
        total: 0,
        limit,
        offset,
      });
    }

    // Get paginated rating entries
    const [entries, total] = await Promise.all([
      prisma.ratingEntry.findMany({
        where: {
          ratingId: { in: ratingIds },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        select: {
          id: true,
          score: true,
          review: true,
          isAnonymous: true,
          createdAt: true,
          rating: {
            select: {
              title: true,
              entityName: true,
            },
          },
        },
      }),
      prisma.ratingEntry.count({
        where: {
          ratingId: { in: ratingIds },
        },
      }),
    ]);

    return NextResponse.json({
      data: entries.map((e) => ({
        id: e.id,
        score: e.score,
        review: e.review,
        isAnonymous: e.isAnonymous,
        createdAt: e.createdAt,
        ratingTitle: e.rating.title,
        entityName: e.rating.entityName,
      })),
      total,
      limit,
      offset,
    });
  } catch (error) {
    logger.error('Business ratings error:', { source: 'api/business/ratings' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Hitilafu ya seva (Server error)' },
      { status: 500 }
    );
  }
}
