import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';
import { logger, getRequestContext } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const anonymousId = request.headers.get('x-anonymous-id');

    if (!anonymousId) {
      return NextResponse.json(
        { error: 'x-anonymous-id header inahitajika' },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(anonymousId)) {
      return NextResponse.json(
        { error: 'x-anonymous-id si sahihi' },
        { status: 400 }
      );
    }

    const hashedAnonId = createHash('sha256').update(anonymousId).digest('hex');

    let user = await prisma.user.findUnique({
      where: { anonymousId: hashedAnonId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: uuidv4(),
          anonymousId: hashedAnonId,
          language: 'sw',
          lastActiveAt: new Date(),
        },
      });
    } else {
      // Update last active
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        points: user.points,
        level: user.level,
        streak: user.streak,
        isPremium: user.isPremium,
        isRegistered: !!(user.email || user.phone),
        username: user.username,
        language: user.language,
      },
    });
  } catch (error) {
    logger.error('Anonymous auth error:', { source: 'api/auth/anonymous' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Hitilafu ya ndani. Tafadhali jaribu tena.' },
      { status: 500 }
    );
  }
}
