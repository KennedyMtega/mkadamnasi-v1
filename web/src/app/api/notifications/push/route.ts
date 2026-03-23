import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { logger, getRequestContext } from '@/lib/logger';

/**
 * POST /api/notifications/push - Register an FCM push token for the current user.
 * Body: { token: string }
 *
 * Adds the token to the user's fcmTokens array if not already present.
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
    const { token } = body as { token?: string };

    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return NextResponse.json(
        { error: 'Tokeni ya push inahitajika.' },
        { status: 400 }
      );
    }

    const trimmedToken = token.trim();

    // Only add if not already present
    if (!user.fcmTokens.includes(trimmedToken)) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          fcmTokens: { push: trimmedToken },
        },
      });
    }

    return NextResponse.json({
      message: 'Tokeni ya push imesajiliwa.',
    });
  } catch (error) {
    logger.error('Error registering push token:', { source: 'api/notifications/push' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications/push - Remove an FCM push token for the current user.
 * Body: { token: string }
 *
 * Removes the specified token from the user's fcmTokens array.
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await getOrCreateAnonymousUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Kitambulisho cha siri kinahitajika.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { token } = body as { token?: string };

    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return NextResponse.json(
        { error: 'Tokeni ya push inahitajika.' },
        { status: 400 }
      );
    }

    const trimmedToken = token.trim();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        fcmTokens: user.fcmTokens.filter(t => t !== trimmedToken),
      },
    });

    return NextResponse.json({
      message: 'Tokeni ya push imeondolewa.',
    });
  } catch (error) {
    logger.error('Error removing push token:', { source: 'api/notifications/push' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
