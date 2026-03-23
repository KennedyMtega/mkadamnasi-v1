import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { logger, getRequestContext } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateAnonymousUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unahitaji kuingia kwanza (Authentication required)' },
        { status: 401 }
      );
    }

    // Find approved business claim for this user
    const claim = await prisma.businessClaim.findFirst({
      where: {
        userId: user.id,
        status: 'APPROVED',
      },
      include: {
        business: true,
      },
    });

    if (!claim || !claim.business) {
      return NextResponse.json(
        { error: 'Huna biashara iliyothibitishwa (No verified business found)' },
        { status: 404 }
      );
    }

    const businessId = claim.business.id;

    // Get ratings for this business
    const ratings = await prisma.rating.findMany({
      where: { businessId },
      select: { id: true },
    });

    const ratingIds = ratings.map((r) => r.id);

    // Get rating entries for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const ratingEntries = await prisma.ratingEntry.findMany({
      where: {
        ratingId: { in: ratingIds },
        createdAt: { gte: sixMonthsAgo },
      },
      orderBy: { createdAt: 'asc' },
      select: {
        score: true,
        createdAt: true,
      },
    });

    // Group by month for rating trend
    const ratingTrend: Record<string, { total: number; count: number }> = {};
    for (const entry of ratingEntries) {
      const monthKey = `${entry.createdAt.getFullYear()}-${String(entry.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (!ratingTrend[monthKey]) {
        ratingTrend[monthKey] = { total: 0, count: 0 };
      }
      ratingTrend[monthKey].total += entry.score;
      ratingTrend[monthKey].count += 1;
    }

    const ratingTrendFormatted = Object.entries(ratingTrend).map(([month, data]) => ({
      month,
      averageRating: Math.round((data.total / data.count) * 10) / 10,
      count: data.count,
    }));

    // Get view count trend (from ratings)
    const viewTrend = await prisma.rating.findMany({
      where: { businessId },
      select: {
        viewCount: true,
        createdAt: true,
        title: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Score distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const entry of ratingEntries) {
      if (entry.score >= 1 && entry.score <= 5) {
        distribution[entry.score as keyof typeof distribution] += 1;
      }
    }

    return NextResponse.json({
      data: {
        ratingTrend: ratingTrendFormatted,
        viewTrend: viewTrend.map((v) => ({
          title: v.title,
          views: v.viewCount,
          date: v.createdAt,
        })),
        distribution,
      },
    });
  } catch (error) {
    logger.error('Business analytics error:', { source: 'api/business/analytics' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Hitilafu ya seva (Server error)' },
      { status: 500 }
    );
  }
}
