import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { createRatingSchema } from '@/lib/validations';
import { checkAndAwardBadges } from '@/lib/badges';

/**
 * GET /api/ratings - List ratings with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const region = searchParams.get('region');
    const featured = searchParams.get('featured');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {
      isActive: true,
      status: 'ACTIVE',
    };

    if (categoryId) where.categoryId = categoryId;
    if (region) where.region = region;
    if (featured === 'true') where.isFeatured = true;

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: [
          { isFeatured: 'desc' },
          { averageRating: 'desc' },
          { totalRatings: 'desc' },
        ],
        take: limit,
        skip: offset,
      }),
      prisma.rating.count({ where }),
    ]);

    return NextResponse.json({
      data: ratings,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ratings - Create a new rating entity
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getOrCreateAnonymousUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Kitambulisho cha siri kinahitajika.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Zod validation
    const parsed = createRatingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Taarifa si sahihi', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description, categoryId, entityName, entityType, region, isAnonymous } = parsed.data;

    const ratingId = uuidv4();

    const rating = await prisma.rating.create({
      data: {
        id: ratingId,
        title: title.trim(),
        description: description?.trim() || null,
        categoryId,
        creatorId: user.id,
        entityName: entityName.trim(),
        entityType,
        region: region || null,
        isAnonymous,
        distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
      },
      include: {
        category: true,
      },
    });

    // Award points for creating a rating
    await prisma.user.update({
      where: { id: user.id },
      data: { points: { increment: 5 } },
    });

    return NextResponse.json({ data: rating }, { status: 201 });
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
