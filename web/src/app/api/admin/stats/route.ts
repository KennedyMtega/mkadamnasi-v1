import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';

async function verifyAdmin(request: NextRequest) {
  const user = await getOrCreateAnonymousUser(request);
  if (!user || !user.isAdmin) {
    return null;
  }
  return user;
}

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Ruhusa imekataliwa (Unauthorized)' }, { status: 403 });
  }

  try {
    const [
      totalUsers,
      activeVotes,
      activeRatings,
      pendingReports,
      bannedUsers,
      premiumUsers,
      totalVoteEntries,
      totalRatingEntries,
      recentUsers,
      recentVotes,
      recentRatings,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.vote.count({ where: { isActive: true, status: 'ACTIVE' } }),
      prisma.rating.count({ where: { isActive: true, status: 'ACTIVE' } }),
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.user.count({ where: { isBanned: true } }),
      prisma.user.count({ where: { isPremium: true } }),
      prisma.voteEntry.count(),
      prisma.ratingEntry.count(),
      prisma.user.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.vote.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.rating.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      activeVotes,
      activeRatings,
      pendingReports,
      bannedUsers,
      premiumUsers,
      totalVoteEntries,
      totalRatingEntries,
      weeklyStats: {
        newUsers: recentUsers,
        newVotes: recentVotes,
        newRatings: recentRatings,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Hitilafu ya seva (Server error)' },
      { status: 500 }
    );
  }
}
