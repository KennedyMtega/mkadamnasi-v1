import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 requests per minute
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { success: rateLimitOk } = rateLimit(`register:${ip}`, 5, 60000);
    if (!rateLimitOk) {
      return NextResponse.json(
        { error: 'Maombi mengi sana. Tafadhali subiri.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Zod validation
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Taarifa si sahihi', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, phone, password, username } = parsed.data;

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
