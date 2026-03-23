import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { createCommentSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rate-limit';
import { logger, getRequestContext } from '@/lib/logger';

/**
 * GET /api/comments - List comments for a vote or rating
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const voteId = searchParams.get('voteId');
    const ratingId = searchParams.get('ratingId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!voteId && !ratingId) {
      return NextResponse.json(
        { error: 'voteId au ratingId inahitajika' },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = {
      parentId: null, // Only top-level comments
      status: 'ACTIVE',
    };

    if (voteId) where.voteId = voteId;
    if (ratingId) where.ratingId = ratingId;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          replies: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'asc' },
            include: {
              user: { select: { id: true, username: true, avatarUrl: true } },
            },
          },
          user: { select: { id: true, username: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.comment.count({ where }),
    ]);

    return NextResponse.json({
      data: comments,
      total,
      limit,
      offset,
    });
  } catch (error) {
    logger.error('Error fetching comments:', { source: 'api/comments' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comments - Create a new comment
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

    // Rate limit: 5 comments per minute
    const { success } = rateLimit(`comment:${user.id}`, 5, 60000);
    if (!success) {
      return NextResponse.json(
        { error: 'Umetuma maoni mengi mno. Subiri kidogo.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    const parsed = createCommentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Taarifa si sahihi', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { content, voteId, ratingId, parentId, isAnonymous } = parsed.data;

    // Create comment and increment commentCount in a transaction
    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          content: content.trim(),
          userId: user.id,
          voteId: voteId || null,
          ratingId: ratingId || null,
          parentId: parentId || null,
          isAnonymous,
        },
        include: {
          user: { select: { id: true, username: true, avatarUrl: true } },
          replies: true,
        },
      });

      // Increment commentCount on the parent vote/rating
      if (voteId) {
        await tx.vote.update({
          where: { id: voteId },
          data: { commentCount: { increment: 1 } },
        });
      }
      if (ratingId) {
        await tx.rating.update({
          where: { id: ratingId },
          data: { commentCount: { increment: 1 } },
        });
      }

      // Award 2 points for commenting
      await tx.user.update({
        where: { id: user.id },
        data: { points: { increment: 2 } },
      });

      return newComment;
    });

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error) {
    logger.error('Error creating comment:', { source: 'api/comments' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
