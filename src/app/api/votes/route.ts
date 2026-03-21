import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { createVoteSchema } from '@/lib/validations';

/**
 * GET /api/votes - List votes with filtering
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

    const [votes, total] = await Promise.all([
      prisma.vote.findMany({
        where,
        include: {
          options: {
            orderBy: { position: 'asc' },
          },
          category: true,
        },
        orderBy: [
          { isFeatured: 'desc' },
          { totalVotes: 'desc' },
          { createdAt: 'desc' },
        ],
        take: limit,
        skip: offset,
      }),
      prisma.vote.count({ where }),
    ]);

    // Calculate percentages for each vote's options
    const votesWithPercentages = votes.map((vote) => ({
      ...vote,
      options: vote.options.map((opt) => ({
        ...opt,
        percentage: vote.totalVotes > 0
          ? Math.round((opt.voteCount / vote.totalVotes) * 100)
          : 0,
      })),
    }));

    return NextResponse.json({
      data: votesWithPercentages,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/votes - Create a new vote/poll
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
    const parsed = createVoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Taarifa si sahihi', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description, type, categoryId, region, options, isAnonymous, endDate: endDateStr } = parsed.data;

    const voteId = uuidv4();
    const endDate = endDateStr ? new Date(endDateStr) : null;

    const vote = await prisma.vote.create({
      data: {
        id: voteId,
        title: title.trim(),
        description: description?.trim() || null,
        type,
        categoryId,
        creatorId: user.id,
        region: region || null,
        isAnonymous,
        endDate,
        options: {
          create: options.map((opt, i: number) => ({
            id: uuidv4(),
            title: opt.title.trim(),
            position: i,
          })),
        },
      },
      include: {
        options: { orderBy: { position: 'asc' } },
        category: true,
      },
    });

    // Award points for creating a vote
    await prisma.user.update({
      where: { id: user.id },
      data: { points: { increment: 5 } },
    });

    return NextResponse.json({ data: vote }, { status: 201 });
  } catch (error) {
    console.error('Error creating vote:', error);
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
