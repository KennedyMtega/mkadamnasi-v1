import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { checkAndAwardBadges } from '@/lib/badges';

/**
 * GET /api/referrals - Get current user's referral stats
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

    // Referral code = first 8 chars of anonymousId
    const referralCode = user.anonymousId.slice(0, 8);

    const [referrals, totalPointsResult] = await Promise.all([
      prisma.referral.findMany({
        where: { referrerId: user.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          pointsAwarded: true,
          createdAt: true,
          referred: {
            select: {
              username: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.referral.aggregate({
        where: { referrerId: user.id },
        _sum: { pointsAwarded: true },
      }),
    ]);

    const totalReferrals = referrals.length;
    const totalPoints = totalPointsResult._sum.pointsAwarded ?? 0;

    // Determine tier
    let tier: { name: string; nameEn: string; minReferrals: number; maxReferrals: number | null };
    if (totalReferrals >= 30) {
      tier = { name: 'Almasi', nameEn: 'Diamond', minReferrals: 30, maxReferrals: null };
    } else if (totalReferrals >= 15) {
      tier = { name: 'Dhahabu', nameEn: 'Gold', minReferrals: 15, maxReferrals: 29 };
    } else if (totalReferrals >= 5) {
      tier = { name: 'Fedha', nameEn: 'Silver', minReferrals: 5, maxReferrals: 14 };
    } else {
      tier = { name: 'Shaba', nameEn: 'Bronze', minReferrals: 0, maxReferrals: 4 };
    }

    return NextResponse.json({
      data: {
        referralCode,
        totalReferrals,
        totalPoints,
        tier,
        referrals: referrals.map((r) => ({
          id: r.id,
          pointsAwarded: r.pointsAwarded,
          createdAt: r.createdAt,
          referredUsername: r.referred.username || 'Mtumiaji Siri',
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/referrals - Claim a referral code (link referred user to referrer)
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
    const { code } = body;

    if (!code || typeof code !== 'string' || code.length < 8) {
      return NextResponse.json(
        { error: 'Nambari ya rufaa si sahihi.' },
        { status: 400 }
      );
    }

    // Find referrer by matching anonymousId prefix
    const referrer = await prisma.user.findFirst({
      where: {
        anonymousId: { startsWith: code.slice(0, 8) },
      },
    });

    if (!referrer) {
      return NextResponse.json(
        { error: 'Nambari ya rufaa haikupatikana.' },
        { status: 404 }
      );
    }

    // Cannot refer yourself
    if (referrer.id === user.id) {
      return NextResponse.json(
        { error: 'Huwezi kujirufaa mwenyewe.' },
        { status: 400 }
      );
    }

    // Check if already referred by this referrer
    const existingReferral = await prisma.referral.findUnique({
      where: {
        referrerId_referredId: {
          referrerId: referrer.id,
          referredId: user.id,
        },
      },
    });

    if (existingReferral) {
      return NextResponse.json(
        { error: 'Umeshafanya rufaa na mtumiaji huyu.' },
        { status: 409 }
      );
    }

    // Check if user was already referred by anyone
    const anyExistingReferral = await prisma.referral.findFirst({
      where: { referredId: user.id },
    });

    if (anyExistingReferral) {
      return NextResponse.json(
        { error: 'Umeshapokea rufaa kutoka kwa mtumiaji mwingine.' },
        { status: 409 }
      );
    }

    const referralId = uuidv4();

    // Create referral and award points in a transaction
    await prisma.$transaction([
      // Create Referral record
      prisma.referral.create({
        data: {
          id: referralId,
          referrerId: referrer.id,
          referredId: user.id,
          code: code.slice(0, 8),
          pointsAwarded: 10,
        },
      }),
      // Award 10 points to referrer
      prisma.user.update({
        where: { id: referrer.id },
        data: { points: { increment: 10 } },
      }),
      // Award 5 points to referred user
      prisma.user.update({
        where: { id: user.id },
        data: { points: { increment: 5 } },
      }),
      // Log activity for referrer
      prisma.activityLog.create({
        data: {
          id: uuidv4(),
          userId: referrer.id,
          type: 'referral_earned',
          title: 'Umepata rufaa mpya',
          description: `Mtumiaji mpya amejiunga kupitia rufaa yako. Pointi +10`,
          metadata: { referralId, referredId: user.id },
        },
      }),
      // Log activity for referred user
      prisma.activityLog.create({
        data: {
          id: uuidv4(),
          userId: user.id,
          type: 'referral_claimed',
          title: 'Umefanya rufaa',
          description: `Umejiunga kupitia rufaa. Pointi +5`,
          metadata: { referralId, referrerId: referrer.id },
        },
      }),
    ]);

    // Check and award badges for the referrer (referral badges)
    const newBadges = await checkAndAwardBadges(referrer.id, prisma);

    return NextResponse.json({
      data: {
        referralId,
        pointsEarned: 5,
        message: 'Rufaa imefanikiwa! Umepata pointi 5.',
      },
      newBadges,
    }, { status: 201 });
  } catch (error) {
    console.error('Error claiming referral:', error);
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
