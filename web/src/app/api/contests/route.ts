import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { createContestSchema } from '@/lib/validations';
import { checkAndAwardBadges } from '@/lib/badges';
import { logger, getRequestContext } from '@/lib/logger';

/**
 * GET /api/contests - List active contests with filtering
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
      type: 'CONTEST',
    };

    if (categoryId) where.categoryId = categoryId;
    if (region) where.region = region;
    if (featured === 'true') where.isFeatured = true;

    const [contests, total] = await Promise.all([
      prisma.vote.findMany({
        where,
        include: {
          options: {
            orderBy: { voteCount: 'desc' },
          },
          contestants: {
            select: {
              id: true,
              code: true,
              fullName: true,
              photoUrl: true,
              isApproved: true,
              optionId: true,
            },
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

    // Enrich options with vote percentages
    const contestsWithPercentages = contests.map((contest) => ({
      ...contest,
      options: contest.options.map((opt) => ({
        ...opt,
        percentage: contest.totalVotes > 0
          ? Math.round((opt.voteCount / contest.totalVotes) * 100)
          : 0,
      })),
    }));

    return NextResponse.json({
      data: contestsWithPercentages,
      total,
      limit,
      offset,
    });
  } catch (error) {
    logger.error('Error fetching contests:', { source: 'api/contests' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}

/**
 * Generate a short URL-safe slug (nanoid-style, 8 chars)
 */
function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 8; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

/**
 * POST /api/contests - Create a new contest
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
    const parsed = createContestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Taarifa si sahihi', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      categoryId,
      imageUrl,
      businessId,
      codePrefix,
      contestants,
      isAnonymous,
      endDate: endDateStr,
      region,
      registrationOpen,
      boostEnabled,
      boostPrice,
    } = parsed.data;

    const voteId = uuidv4();
    const endDate = endDateStr ? new Date(endDateStr) : null;
    const registrationSlug = generateSlug();

    const contest = await prisma.$transaction(async (tx) => {
      // Create the contest (Vote with type=CONTEST)
      const vote = await tx.vote.create({
        data: {
          id: voteId,
          title: title.trim(),
          description: description?.trim() || null,
          type: 'CONTEST',
          categoryId,
          creatorId: user.id,
          businessId: businessId || null,
          region: region || null,
          imageUrl: imageUrl || null,
          isAnonymous,
          endDate,
          boostEnabled,
          boostPrice: boostPrice ?? null,
          contestRegistrationOpen: registrationOpen,
          registrationSlug,
          codePrefix,
        },
      });

      // Create VoteOption + Contestant for each contestant
      for (let i = 0; i < contestants.length; i++) {
        const c = contestants[i];
        const optionId = uuidv4();
        const code = `${codePrefix}${String(i + 1).padStart(3, '0')}`;

        await tx.voteOption.create({
          data: {
            id: optionId,
            voteId,
            title: c.fullName.trim(),
            description: c.bio?.trim() || null,
            imageUrl: c.photoUrl || null,
            position: i,
          },
        });

        await tx.contestant.create({
          data: {
            id: uuidv4(),
            voteId,
            optionId,
            code,
            fullName: c.fullName.trim(),
            bio: c.bio?.trim() || null,
            photoUrl: c.photoUrl || null,
            registeredBy: 'creator',
            isApproved: true,
            metadata: c.metadata ?? null,
          },
        });
      }

      // Award 5 points to creator
      await tx.user.update({
        where: { id: user.id },
        data: { points: { increment: 5 } },
      });

      // Return full contest with relations
      return tx.vote.findUnique({
        where: { id: voteId },
        include: {
          options: { orderBy: { position: 'asc' } },
          contestants: true,
          category: true,
        },
      });
    });

    // Check and award badges (non-blocking)
    const newBadges = await checkAndAwardBadges(user.id, prisma).catch((err) => {
      logger.error('Failed to check badges:', { source: 'api/contests' }, error instanceof Error ? error : new Error(String(error)));
      return [] as string[];
    });

    return NextResponse.json({ data: contest, newBadges }, { status: 201 });
  } catch (error) {
    logger.error('Error creating contest:', { source: 'api/contests' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
