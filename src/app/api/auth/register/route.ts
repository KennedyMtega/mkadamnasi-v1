import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, password, username } = body;

    // Validate: at least email or phone required
    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Barua pepe au nambari ya simu inahitajika' },
        { status: 400 }
      );
    }

    // Validate password
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Nywila lazima iwe na herufi 6 au zaidi' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Barua pepe si sahihi' },
        { status: 400 }
      );
    }

    // Validate phone format if provided (Tanzania: +255 or 0 prefix)
    if (phone && !/^(\+?255|0)\d{9}$/.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Nambari ya simu si sahihi' },
        { status: 400 }
      );
    }

    // Validate username if provided
    if (username) {
      if (username.length < 3 || username.length > 30) {
        return NextResponse.json(
          { error: 'Jina la mtumiaji lazima liwe herufi 3-30' },
          { status: 400 }
        );
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return NextResponse.json(
          { error: 'Jina la mtumiaji linaweza kuwa na herufi, nambari, na _ tu' },
          { status: 400 }
        );
      }
    }

    // Check for duplicates
    const duplicateChecks = [];
    if (email) {
      duplicateChecks.push({ email: email.toLowerCase() });
    }
    if (phone) {
      duplicateChecks.push({ phone: phone.replace(/\s/g, '') });
    }
    if (username) {
      duplicateChecks.push({ username });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: duplicateChecks },
    });

    if (existingUser) {
      if (email && existingUser.email === email.toLowerCase()) {
        return NextResponse.json(
          { error: 'Barua pepe hii tayari imetumika' },
          { status: 409 }
        );
      }
      if (phone && existingUser.phone === phone.replace(/\s/g, '')) {
        return NextResponse.json(
          { error: 'Nambari ya simu hii tayari imetumika' },
          { status: 409 }
        );
      }
      if (username && existingUser.username === username) {
        return NextResponse.json(
          { error: 'Jina la mtumiaji hili tayari limetumika' },
          { status: 409 }
        );
      }
    }

    // Generate anonymous ID and hash password
    const rawAnonymousId = uuidv4();
    const hashedAnonId = createHash('sha256').update(rawAnonymousId).digest('hex');
    const passwordHash = await hash(password, 12);

    // Check if caller has an existing anonymous session to merge
    const existingAnonId = request.headers.get('x-anonymous-id');
    let mergedFromUser = null;

    if (existingAnonId) {
      const existingHashedId = createHash('sha256').update(existingAnonId).digest('hex');
      mergedFromUser = await prisma.user.findUnique({
        where: { anonymousId: existingHashedId },
      });
    }

    if (mergedFromUser && !mergedFromUser.email && !mergedFromUser.phone) {
      // Upgrade the existing anonymous user to a registered user
      const user = await prisma.user.update({
        where: { id: mergedFromUser.id },
        data: {
          email: email ? email.toLowerCase() : undefined,
          phone: phone ? phone.replace(/\s/g, '') : undefined,
          username: username || undefined,
          passwordHash,
          lastActiveAt: new Date(),
        },
      });

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          username: user.username,
          anonymousId: existingAnonId,
          points: user.points,
          level: user.level,
          isAdmin: user.isAdmin,
          isPremium: user.isPremium,
        },
        merged: true,
      }, { status: 201 });
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        anonymousId: hashedAnonId,
        email: email ? email.toLowerCase() : undefined,
        phone: phone ? phone.replace(/\s/g, '') : undefined,
        username: username || undefined,
        passwordHash,
        language: 'sw',
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        username: user.username,
        anonymousId: rawAnonymousId,
        points: user.points,
        level: user.level,
        isAdmin: user.isAdmin,
        isPremium: user.isPremium,
      },
      merged: false,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Hitilafu ya ndani. Tafadhali jaribu tena.' },
      { status: 500 }
    );
  }
}
