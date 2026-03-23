import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { logger, getRequestContext } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const ctx = getRequestContext(request, 'api/admin/logs/GET');
  try {
    const user = await getOrCreateAnonymousUser(request);
    if (!user?.isAdmin) {
      logger.warn('Unauthorized access to system logs', ctx);
      return NextResponse.json({ error: 'Ruhusa imekataliwa' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const source = searchParams.get('source');
    const search = searchParams.get('search');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Record<string, unknown> = {};
    if (level && level !== 'all') where.level = level;
    if (source) where.source = { contains: source, mode: 'insensitive' };
    if (search) where.message = { contains: search, mode: 'insensitive' };
    if (from || to) {
      where.createdAt = {};
      if (from) (where.createdAt as Record<string, unknown>).gte = new Date(from);
      if (to) (where.createdAt as Record<string, unknown>).lte = new Date(to);
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [logs, total, errorsCount, warnsCount] = await Promise.all([
      prisma.systemLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.systemLog.count({ where }),
      prisma.systemLog.count({ where: { level: 'error', createdAt: { gte: twentyFourHoursAgo } } }),
      prisma.systemLog.count({ where: { level: 'warn', createdAt: { gte: twentyFourHoursAgo } } }),
    ]);

    return NextResponse.json({
      data: logs,
      total,
      limit,
      offset,
      summary: {
        errors24h: errorsCount,
        warnings24h: warnsCount,
        totalLogs: total,
      },
    });
  } catch (error) {
    logger.error('Failed to fetch system logs', { ...ctx, statusCode: 500 }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json({ error: 'Tatizo la seva' }, { status: 500 });
  }
}
