import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';

/**
 * GET /api/users - Get current user profile
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateAnonymousUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Kitambulisho cha siri kinahitajika.' },
        { status: 401 }
      );
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        bio: true,
        region: true,
        language: true,
        points: true,
        level: true,
        streak: true,
        isPremium: true,
        isVerified: true,
        avatarUrl: true,
        lastActiveAt: true,
        createdAt: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Mtumiaji hajapatikana.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users - Update user profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getOrCreateAnonymousUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Kitambulisho cha siri kinahitajika.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, bio, region, language } = body;

    // Validate username if provided
    if (username !== undefined) {
      if (username && (username.length < 3 || username.length > 30)) {
        return NextResponse.json(
          { error: 'Jina la mtumiaji lazima liwe na herufi 3-30.' },
          { status: 400 }
        );
      }

      if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
        return NextResponse.json(
          { error: 'Jina la mtumiaji linaweza kuwa na herufi, namba na _ tu.' },
          { status: 400 }
        );
      }

      // Check uniqueness
      if (username) {
        const existing = await prisma.user.findUnique({
          where: { username },
        });
        if (existing && existing.id !== user.id) {
          return NextResponse.json(
            { error: 'Jina hili la mtumiaji limetumika tayari.' },
            { status: 409 }
          );
        }
      }
    }

    // Validate bio length
    if (bio !== undefined && bio && bio.length > 200) {
      return NextResponse.json(
        { error: 'Maelezo mafupi hayawezi kuzidi herufi 200.' },
        { status: 400 }
      );
    }

    // Validate language
    const allowedLanguages = ['sw', 'en'];
    if (language !== undefined && !allowedLanguages.includes(language)) {
      return NextResponse.json(
        { error: 'Lugha isiyotambuliwa.' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (username !== undefined) updateData.username = username || null;
    if (bio !== undefined) updateData.bio = bio || null;
    if (region !== undefined) updateData.region = region || null;
    if (language !== undefined) updateData.language = language;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        bio: true,
        region: true,
        language: true,
        points: true,
        level: true,
        streak: true,
        isPremium: true,
        isVerified: true,
        avatarUrl: true,
        lastActiveAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
