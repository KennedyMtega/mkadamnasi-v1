import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { logger, getRequestContext } from '@/lib/logger';

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

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';
  const filter = searchParams.get('filter') || 'all';

  try {
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { anonymousId: { contains: search, mode: 'insensitive' } },
      ];
    }

    switch (filter) {
      case 'premium':
        where.isPremium = true;
        break;
      case 'banned':
        where.isBanned = true;
        break;
      case 'verified':
        where.isVerified = true;
        break;
      case 'admin':
        where.isAdmin = true;
        break;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          anonymousId: true,
          username: true,
          email: true,
          points: true,
          level: true,
          isPremium: true,
          isBanned: true,
          isVerified: true,
          isAdmin: true,
          banReason: true,
          region: true,
          createdAt: true,
          lastActiveAt: true,
          _count: {
            select: {
              voteEntries: true,
              ratingEntries: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Admin users error:', { source: 'api/admin/users' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Hitilafu ya seva (Server error)' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Ruhusa imekataliwa (Unauthorized)' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { userId, action, reason } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'userId na action zinahitajika (userId and action required)' },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: 'Mtumiaji hajapatikana (User not found)' }, { status: 404 });
    }

    let updatedUser;

    switch (action) {
      case 'ban':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isBanned: true, banReason: reason || 'Umezuiwa na Admin' },
        });
        break;
      case 'unban':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isBanned: false, banReason: null },
        });
        break;
      case 'make_admin':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isAdmin: true },
        });
        break;
      case 'remove_admin':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { isAdmin: false },
        });
        break;
      default:
        return NextResponse.json({ error: 'Kitendo kisichojulikana (Unknown action)' }, { status: 400 });
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action,
        target: 'user',
        targetId: userId,
        oldData: { isBanned: targetUser.isBanned, isAdmin: targetUser.isAdmin },
        newData: { isBanned: updatedUser.isBanned, isAdmin: updatedUser.isAdmin },
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    logger.error('Admin user action error:', { source: 'api/admin/users' }, error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: 'Hitilafu ya seva (Server error)' },
      { status: 500 }
    );
  }
}
