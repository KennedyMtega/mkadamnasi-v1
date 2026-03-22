import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser, hashIp, getClientIp } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { submitRatingSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rate-limit';
import { createRatingMilestoneNotification } from '@/lib/notifications';
import { checkAndAwardBadges } from '@/lib/badges';

/**
 * POST /api/ratings/[id]/submit - Submit a rating (1-5 stars + optional review)
 * Anonymous and one-rating-per-user enforced.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting: 30 requests per minute
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { success: rateLimitOk } = rateLimit(`submit-rating:${ip}`, 30, 60000);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: 'Maombi mengi sana. Tafadhali subiri.' },
        { status: 429 }
      );
    }

    const { id: ratingId } = await params;
    const user = await getOrCreateAnonymousUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Kitambulisho cha siri kinahitajika.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Zod validation
    const parsed = submitRatingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Taarifa si sahihi', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { score, review } = parsed.data;

    // Verify rating exists and is active
    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      return NextResponse.json(
        { error: 'Kadirio halikupatikana.' },
        { status: 404 }
      );
    }

    if (!rating.isActive || rating.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Kadirio hili haliko hai tena.' },
        { status: 400 }
      );
    }

    // Check if user already rated
    const existingEntry = await prisma.ratingEntry.findUnique({
      where: { ratingId_userId: { ratingId, userId: user.id } },
    });

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Umeshaweka kadirio katika hili.' },
        { status: 409 }
      );
    }

    // Get fraud detection data
    const clientIp = getClientIp(request);
    const ipHash = hashIp(clientIp);
    const deviceFingerprint = request.headers.get('x-device-fingerprint') || null;

    // Update distribution
    const distribution = (rating.distribution as Record<string, number>) || {
      '1': 0, '2': 0, '3': 0, '4': 0, '5': 0,
    };
    distribution[score.toString()] = (distribution[score.toString()] || 0) + 1;

    // Calculate new average
    const newTotalRatings = rating.totalRatings + 1;
    const newAverageRating = parseFloat(
      (
        (rating.averageRating * rating.totalRatings + score) / newTotalRatings
      ).toFixed(1)
    );

    // Submit rating in a transaction
    await prisma.$transaction([
      prisma.ratingEntry.create({
        data: {
          id: uuidv4(),
          ratingId,
          userId: user.id,
          score: Math.round(score),
          review: review?.trim() || null,
          isAnonymous: rating.isAnonymous,
          ipHash,
          deviceFingerprint,
        },
      }),
      prisma.rating.update({
        where: { id: ratingId },
        data: {
          totalRatings: newTotalRatings,
          averageRating: newAverageRating,
          distribution,
        },
      }),
      // Award points to user
      prisma.user.update({
        where: { id: user.id },
        data: { points: { increment: 3 } },
      }),
    ]);

    // Notify rating creator every 5th rating (non-blocking)
    if (newTotalRatings % 5 === 0 && rating.creatorId !== user.id) {
      createRatingMilestoneNotification(
        rating.creatorId,
        rating.title,
        ratingId,
        newTotalRatings
      ).catch((err) => console.error('Failed to create rating milestone notification:', err));
    }

    // Check and award badges (non-blocking)
    const newBadges = await checkAndAwardBadges(user.id, prisma).catch((err) => {
      console.error('Failed to check badges:', err);
      return [] as string[];
    });

    return NextResponse.json({
      data: {
        averageRating: newAverageRating,
        totalRatings: newTotalRatings,
        distribution,
        hasRated: true,
        userScore: score,
      },
      newBadges,
      message: 'Kadirio lako limehifadhiwa! Asante.',
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
