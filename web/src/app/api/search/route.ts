import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger, getRequestContext } from '@/lib/logger';

/**
 * GET /api/search - Full-text search across votes and ratings
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();
    const type = searchParams.get('type') || 'all'; // vote | rating | all
    const categoryId = searchParams.get('categoryId');
    const region = searchParams.get('region');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!q || q.length < 2) {
      return NextResponse.json({
        data: [],
        total: 0,
        limit,
        offset,
      });
    }

    const searchFilter = { contains: q, mode: 'insensitive' as const };

    const results: Array<{
      id: string;
      type: 'vote' | 'rating';
      title: string;
      description: string | null;
      category: { id: string; name: string; icon: string };
      region: string | null;
      participants: number;
      averageRating?: number;
      createdAt: Date;
    }> = [];

    // Search votes (includes contests)
    if (type === 'all' || type === 'vote') {
      const voteWhere: Record<string, unknown> = {
        isActive: true,
        status: 'ACTIVE',
        OR: [
          { title: searchFilter },
          { description: searchFilter },
          { contestants: { some: { fullName: searchFilter } } },
          { contestants: { some: { code: searchFilter } } },
        ],
      };
      if (categoryId) voteWhere.categoryId = categoryId;
      if (region) voteWhere.region = region;

      const [votes, voteCount] = await Promise.all([
        prisma.vote.findMany({
          where: voteWhere,
          include: { category: true },
          orderBy: { totalVotes: 'desc' },
          take: type === 'all' ? Math.ceil(limit / 2) : limit,
          skip: type === 'all' ? 0 : offset,
        }),
        prisma.vote.count({ where: voteWhere }),
      ]);

      for (const vote of votes) {
        results.push({
          id: vote.id,
          type: 'vote',
          title: vote.title,
          description: vote.description,
          category: {
            id: vote.category.id,
            name: vote.category.name,
            icon: vote.category.icon,
          },
          region: vote.region,
          participants: vote.totalVotes,
          createdAt: vote.createdAt,
        });
      }

      if (type === 'vote') {
        return NextResponse.json({
          data: results,
          total: voteCount,
          limit,
          offset,
        });
      }
    }

    // Search ratings
    if (type === 'all' || type === 'rating') {
      const ratingWhere: Record<string, unknown> = {
        isActive: true,
        status: 'ACTIVE',
        OR: [
          { title: searchFilter },
          { description: searchFilter },
          { entityName: searchFilter },
        ],
      };
      if (categoryId) ratingWhere.categoryId = categoryId;
      if (region) ratingWhere.region = region;

      const [ratings, ratingCount] = await Promise.all([
        prisma.rating.findMany({
          where: ratingWhere,
          include: { category: true },
          orderBy: { totalRatings: 'desc' },
          take: type === 'all' ? Math.ceil(limit / 2) : limit,
          skip: type === 'all' ? 0 : offset,
        }),
        prisma.rating.count({ where: ratingWhere }),
      ]);

      for (const rating of ratings) {
        results.push({
          id: rating.id,
          type: 'rating',
          title: rating.title,
          description: rating.description,
          category: {
            id: rating.category.id,
            name: rating.category.name,
            icon: rating.category.icon,
          },
          region: rating.region,
          participants: rating.totalRatings,
          averageRating: rating.averageRating,
          createdAt: rating.createdAt,
        });
      }

      if (type === 'rating') {
        return NextResponse.json({
          data: results,
          total: ratingCount,
          limit,
          offset,
        });
      }
    }

    // For 'all' type, sort combined results by participants
    results.sort((a, b) => b.participants - a.participants);

    return NextResponse.json({
      data: results.slice(offset, offset + limit),
      total: results.length,
      limit,
      offset,
    });
  } catch (error) {
    logger.error('Error searching:', { source: 'api/search' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
