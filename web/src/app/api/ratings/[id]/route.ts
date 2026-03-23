import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger, getRequestContext } from '@/lib/logger';

/**
 * GET /api/ratings/[id] - Get a single rating with distribution and reviews
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const rating = await prisma.rating.findUnique({
      where: { id },
      include: {
        category: true,
        entries: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true,
            score: true,
            review: true,
            isAnonymous: true,
            createdAt: true,
          },
        },
      },
    });

    if (!rating) {
      return NextResponse.json(
        { error: 'Kadirio halikupatikana.' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.rating.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    // Check if anonymous user has already rated
    const anonymousId = request.headers.get('x-anonymous-id');
    let hasRated = false;
    let userScore: number | null = null;
    let userReview: string | null = null;

    if (anonymousId) {
      const { createHash } = await import('crypto');
      const hashedAnonId = createHash('sha256').update(anonymousId).digest('hex');
      const user = await prisma.user.findUnique({
        where: { anonymousId: hashedAnonId },
      });

      if (user) {
        const existingEntry = await prisma.ratingEntry.findUnique({
          where: { ratingId_userId: { ratingId: id, userId: user.id } },
        });
        if (existingEntry) {
          hasRated = true;
          userScore = existingEntry.score;
          userReview = existingEntry.review;
        }
      }
    }

    // Filter reviews to only show ones with text content
    const recentReviews = rating.entries
      .filter((e) => e.review && e.review.trim().length > 0)
      .map((e) => ({
        id: e.id,
        score: e.score,
        review: e.review,
        createdAt: e.createdAt,
      }));

    return NextResponse.json({
      data: {
        id: rating.id,
        title: rating.title,
        description: rating.description,
        entityName: rating.entityName,
        entityType: rating.entityType,
        category: rating.category,
        region: rating.region,
        averageRating: rating.averageRating,
        totalRatings: rating.totalRatings,
        distribution: rating.distribution,
        isAnonymous: rating.isAnonymous,
        createdAt: rating.createdAt,
        hasRated,
        userScore,
        userReview,
        recentReviews,
      },
    });
  } catch (error) {
    logger.error('Error fetching rating:', { source: 'api/ratings/[id]' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
