import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { logger, getRequestContext } from '@/lib/logger';

/**
 * DELETE /api/comments/[id] - Delete own comment
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await getOrCreateAnonymousUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Kitambulisho cha siri kinahitajika.' },
        { status: 401 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Maoni hayajapatikana.' },
        { status: 404 }
      );
    }

    if (comment.userId !== user.id) {
      return NextResponse.json(
        { error: 'Huna ruhusa ya kufuta maoni haya.' },
        { status: 403 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.comment.update({
        where: { id },
        data: { status: 'REMOVED' },
      });

      // Decrement commentCount on the parent vote/rating
      if (comment.voteId) {
        await tx.vote.update({
          where: { id: comment.voteId },
          data: { commentCount: { decrement: 1 } },
        });
      }
      if (comment.ratingId) {
        await tx.rating.update({
          where: { id: comment.ratingId },
          data: { commentCount: { decrement: 1 } },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting comment:', { source: 'api/comments/[id]' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/comments/[id] - Like a comment
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.action !== 'like') {
      return NextResponse.json(
        { error: 'Kitendo kisichojulikana.' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Maoni hayajapatikana.' },
        { status: 404 }
      );
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { likesCount: { increment: 1 } },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    logger.error('Error liking comment:', { source: 'api/comments/[id]' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
