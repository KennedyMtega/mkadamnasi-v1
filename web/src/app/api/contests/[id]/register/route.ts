import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { contestRegistrationSchema } from '@/lib/validations';

/**
 * POST /api/contests/[id]/register - Contestant self-registration
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: voteId } = await params;
    const user = await getOrCreateAnonymousUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Kitambulisho cha siri kinahitajika.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Zod validation
    const parsed = contestRegistrationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Taarifa si sahihi', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { fullName, bio, photoUrl, metadata } = parsed.data;

    // Verify contest exists and registration is open
    const contest = await prisma.vote.findUnique({
      where: { id: voteId },
      select: {
        id: true,
        type: true,
        contestRegistrationOpen: true,
        codePrefix: true,
        status: true,
        isActive: true,
      },
    });

    if (!contest || contest.type !== 'CONTEST') {
      return NextResponse.json(
        { error: 'Shindano halipatikani. / Contest not found.' },
        { status: 404 }
      );
    }

    if (!contest.isActive || contest.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Shindano halipo hai. / Contest is not active.' },
        { status: 400 }
      );
    }

    if (!contest.contestRegistrationOpen) {
      return NextResponse.json(
        { error: 'Usajili umefungwa. / Registration is closed.' },
        { status: 400 }
      );
    }

    const contestant = await prisma.$transaction(async (tx) => {
      // Count existing contestants to generate next code
      const existingCount = await tx.contestant.count({
        where: { voteId },
      });

      const prefix = contest.codePrefix || 'C';
      const code = `${prefix}${String(existingCount + 1).padStart(3, '0')}`;
      const optionId = uuidv4();

      // Determine next position
      const lastOption = await tx.voteOption.findFirst({
        where: { voteId },
        orderBy: { position: 'desc' },
        select: { position: true },
      });
      const nextPosition = (lastOption?.position ?? -1) + 1;

      // Create VoteOption for this contestant
      await tx.voteOption.create({
        data: {
          id: optionId,
          voteId,
          title: fullName.trim(),
          description: bio?.trim() || null,
          imageUrl: photoUrl || null,
          position: nextPosition,
        },
      });

      // Create Contestant record
      return tx.contestant.create({
        data: {
          id: uuidv4(),
          voteId,
          optionId,
          code,
          fullName: fullName.trim(),
          bio: bio?.trim() || null,
          photoUrl: photoUrl || null,
          registeredBy: 'self',
          isApproved: true,
          metadata: metadata ?? null,
        },
        include: {
          option: {
            select: { id: true, voteCount: true },
          },
        },
      });
    });

    return NextResponse.json({ data: contestant }, { status: 201 });
  } catch (error) {
    console.error('Error registering contestant:', error);
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
