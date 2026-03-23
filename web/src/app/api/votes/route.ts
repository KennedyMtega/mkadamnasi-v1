import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { createVoteSchema } from '@/lib/validations';
import { checkAndAwardBadges } from '@/lib/badges';
import { rankByTrending } from '@/lib/algorithms/trending';
import { logger, getRequestContext } from '@/lib/logger';

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

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
      isPublic: true, // Only show public polls in listings
    };

    if (categoryId) where.categoryId = categoryId;
    if (region) where.region = region;
    if (featured === 'true') where.isFeatured = true;

    const useTrending = searchParams.get('sort') === 'trending';

    const [votes, total] = await Promise.all([
      prisma.vote.findMany({
        where,
        include: {
          options: {
            orderBy: { position: 'asc' },
          },
          category: true,
          contestants: { select: { id: true, code: true, fullName: true, photoUrl: true } },
        },
        orderBy: useTrending
          ? [{ createdAt: 'desc' }] // Will re-sort with algorithm
          : [
              { isFeatured: 'desc' },
              { totalVotes: 'desc' },
              { createdAt: 'desc' },
            ],
        take: useTrending ? limit * 3 : limit, // Fetch more for re-ranking
        skip: useTrending ? 0 : offset,
      }),
      prisma.vote.count({ where }),
    ]);

    // Apply trending algorithm if requested
    let sortedVotes = votes;
    if (useTrending && votes.length > 0) {
      const ranked = rankByTrending(
        votes.map((v) => ({
          id: v.id,
          totalVotes: v.totalVotes,
          viewCount: v.viewCount,
          shareCount: v.shareCount,
          createdAt: v.createdAt,
          isFeatured: v.isFeatured,
          isPinned: v.isPinned,
        }))
      );
      const rankedIds = ranked.map((r) => r.id);
      sortedVotes = rankedIds
        .map((id) => votes.find((v) => v.id === id)!)
        .filter(Boolean)
        .slice(offset, offset + limit);
    }

    // Calculate percentages and add field aliases for mobile compatibility
    const votesWithPercentages = sortedVotes.map((vote) => ({
      ...vote,
      expiresAt: vote.endDate, // Alias for mobile compatibility
      options: vote.options.map((opt) => ({
        ...opt,
        label: opt.title, // Alias for mobile compatibility
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
    const ctx = getRequestContext(request, 'api/votes/GET');
    logger.error('Failed to fetch votes', { ...ctx, statusCode: 500 }, error instanceof Error ? error : new Error(String(error)));
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
  const ctx = getRequestContext(request, 'api/votes/POST');
  const startTime = Date.now();
  try {
    const user = await getOrCreateAnonymousUser(request);
    if (!user) {
      logger.warn('Vote creation rejected: missing anonymous ID', ctx);
      return NextResponse.json(
        { error: 'Kitambulisho cha siri kinahitajika.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Zod validation
    const parsed = createVoteSchema.safeParse(body);
    if (!parsed.success) {
      logger.warn('Vote creation validation failed', { ...ctx, userId: user.id, metadata: { errors: parsed.error.flatten().fieldErrors } });
      return NextResponse.json(
        { error: 'Taarifa si sahihi', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description, type, categoryId, region, options, isAnonymous, endDate: endDateStr, imageUrl, businessId } = parsed.data;
    const visibility = (body.visibility as string) || 'public';
    const isPublic = body.isPublic !== undefined ? body.isPublic : visibility === 'public';

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
        businessId: businessId || null,
        region: region || null,
        imageUrl: imageUrl || null,
        isAnonymous,
        isPublic,
        visibility,
        endDate,
        options: {
          create: options.map((opt, i: number) => ({
            id: uuidv4(),
            title: opt.title.trim(),
            description: opt.description?.trim() || null,
            imageUrl: opt.imageUrl || null,
            position: i,
          })),
        },
      },
      include: {
        options: { orderBy: { position: 'asc' } },
        category: true,
      },
    });

    // Create invite code for private polls
    let inviteCode: string | null = null;
    if (visibility === 'invite_only' || visibility === 'qr_only') {
      inviteCode = generateInviteCode();
      await prisma.pollInvite.create({
        data: {
          voteId: vote.id,
          inviteCode,
        },
      });
    }

    // Award points for creating a vote
    await prisma.user.update({
      where: { id: user.id },
      data: { points: { increment: 5 } },
    });

    // Check and award badges (non-blocking)
    const newBadges = await checkAndAwardBadges(user.id, prisma).catch((err) => {
      logger.error('Failed to check badges after vote creation', { ...ctx, userId: user.id }, err instanceof Error ? err : new Error(String(err)));
      return [] as string[];
    });

    logger.info('Vote created successfully', { ...ctx, userId: user.id, duration: Date.now() - startTime, metadata: { voteId: vote.id, visibility } });

    return NextResponse.json({ data: { ...vote, inviteCode }, newBadges }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create vote', { ...ctx, statusCode: 500, duration: Date.now() - startTime }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
