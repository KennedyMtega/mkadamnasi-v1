import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

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
    const { title, description, type, categoryId, region, options, isAnonymous, duration } = body;

    // Validation
    if (!title || title.length < 3) {
      return NextResponse.json(
        { error: 'Kichwa lazima kiwe na herufi 3 au zaidi.' },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Kategoria inahitajika.' },
        { status: 400 }
      );
    }

    if (!options || !Array.isArray(options) || options.filter((o: string) => o.trim()).length < 2) {
      return NextResponse.json(
        { error: 'Chaguzi 2 au zaidi zinahitajika.' },
        { status: 400 }
      );
    }

    const filteredOptions = options.filter((o: string) => o.trim());
    if (filteredOptions.length > 10) {
      return NextResponse.json(
        { error: 'Chaguzi haziwezi kuzidi 10.' },
        { status: 400 }
      );
    }

    const voteId = uuidv4();
    const endDate = duration
      ? new Date(Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000)
      : null;

    const voteType = type?.toUpperCase() || 'POLL';

    const vote = await prisma.vote.create({
      data: {
        id: voteId,
        title: title.trim(),
        description: description?.trim() || null,
        type: voteType,
        categoryId,
        creatorId: user.id,
        region: region || null,
        isAnonymous: isAnonymous !== false,
        endDate,
        options: {
          create: filteredOptions.map((opt: string, i: number) => ({
            id: uuidv4(),
            title: opt.trim(),
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
