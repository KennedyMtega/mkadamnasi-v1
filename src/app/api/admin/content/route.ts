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

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'votes';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const filter = searchParams.get('filter') || 'all';

  try {
    if (type === 'votes') {
      const where: Record<string, unknown> = {};

      switch (filter) {
        case 'active':
          where.isActive = true;
          where.status = 'ACTIVE';
          break;
        case 'featured':
          where.isFeatured = true;
          break;
        case 'flagged':
          where.status = 'FLAGGED';
          break;
        case 'archived':
          where.status = 'ARCHIVED';
          break;
        case 'removed':
          where.status = 'REMOVED';
          break;
      }

      const [votes, total] = await Promise.all([
        prisma.vote.findMany({
          where,
          include: {
            category: { select: { name: true, nameEn: true, icon: true } },
            creator: { select: { id: true, username: true, anonymousId: true } },
            _count: { select: { entries: true, options: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.vote.count({ where }),
      ]);

      return NextResponse.json({
        items: votes,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }

    if (type === 'ratings') {
      const where: Record<string, unknown> = {};

      switch (filter) {
        case 'active':
          where.isActive = true;
          where.status = 'ACTIVE';
          break;
        case 'featured':
          where.isFeatured = true;
          break;
        case 'flagged':
          where.status = 'FLAGGED';
          break;
        case 'archived':
          where.status = 'ARCHIVED';
          break;
        case 'removed':
          where.status = 'REMOVED';
          break;
      }

      const [ratings, total] = await Promise.all([
        prisma.rating.findMany({
          where,
          include: {
            category: { select: { name: true, nameEn: true, icon: true } },
            creator: { select: { id: true, username: true, anonymousId: true } },
            _count: { select: { entries: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.rating.count({ where }),
      ]);

      return NextResponse.json({
        items: ratings,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    }

    return NextResponse.json({ error: 'Aina isiyojulikana (Unknown type)' }, { status: 400 });
  } catch (error) {
    console.error('Admin content error:', error);
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
    const { type, id, action } = body;

    if (!type || !id || !action) {
      return NextResponse.json(
        { error: 'type, id, na action zinahitajika (type, id, and action required)' },
        { status: 400 }
      );
    }

    if (type === 'vote') {
      const vote = await prisma.vote.findUnique({ where: { id } });
      if (!vote) {
        return NextResponse.json({ error: 'Kura haijapatikana (Vote not found)' }, { status: 404 });
      }

      let updatedVote;
      switch (action) {
        case 'feature':
          updatedVote = await prisma.vote.update({ where: { id }, data: { isFeatured: true } });
          break;
        case 'unfeature':
          updatedVote = await prisma.vote.update({ where: { id }, data: { isFeatured: false } });
          break;
        case 'pin':
          updatedVote = await prisma.vote.update({ where: { id }, data: { isPinned: true } });
          break;
        case 'unpin':
          updatedVote = await prisma.vote.update({ where: { id }, data: { isPinned: false } });
          break;
        case 'archive':
          updatedVote = await prisma.vote.update({
            where: { id },
            data: { status: 'ARCHIVED', isActive: false },
          });
          break;
        case 'activate':
          updatedVote = await prisma.vote.update({
            where: { id },
            data: { status: 'ACTIVE', isActive: true },
          });
          break;
        case 'remove':
          updatedVote = await prisma.vote.update({
            where: { id },
            data: { status: 'REMOVED', isActive: false },
          });
          break;
        default:
          return NextResponse.json({ error: 'Kitendo kisichojulikana (Unknown action)' }, { status: 400 });
      }

      await prisma.auditLog.create({
        data: {
          adminId: admin.id,
          action: `vote_${action}`,
          target: 'vote',
          targetId: id,
          oldData: { status: vote.status, isFeatured: vote.isFeatured, isPinned: vote.isPinned },
          newData: { status: updatedVote.status, isFeatured: updatedVote.isFeatured, isPinned: updatedVote.isPinned },
        },
      });

      return NextResponse.json({ item: updatedVote });
    }

    if (type === 'rating') {
      const rating = await prisma.rating.findUnique({ where: { id } });
      if (!rating) {
        return NextResponse.json({ error: 'Tathmini haijapatikana (Rating not found)' }, { status: 404 });
      }

      let updatedRating;
      switch (action) {
        case 'feature':
          updatedRating = await prisma.rating.update({ where: { id }, data: { isFeatured: true } });
          break;
        case 'unfeature':
          updatedRating = await prisma.rating.update({ where: { id }, data: { isFeatured: false } });
          break;
        case 'archive':
          updatedRating = await prisma.rating.update({
            where: { id },
            data: { status: 'ARCHIVED', isActive: false },
          });
          break;
        case 'activate':
          updatedRating = await prisma.rating.update({
            where: { id },
            data: { status: 'ACTIVE', isActive: true },
          });
          break;
        case 'remove':
          updatedRating = await prisma.rating.update({
            where: { id },
            data: { status: 'REMOVED', isActive: false },
          });
          break;
        default:
          return NextResponse.json({ error: 'Kitendo kisichojulikana (Unknown action)' }, { status: 400 });
      }

      await prisma.auditLog.create({
        data: {
          adminId: admin.id,
          action: `rating_${action}`,
          target: 'rating',
          targetId: id,
          oldData: { status: rating.status, isFeatured: rating.isFeatured },
          newData: { status: updatedRating.status, isFeatured: updatedRating.isFeatured },
        },
      });

      return NextResponse.json({ item: updatedRating });
    }

    return NextResponse.json({ error: 'Aina isiyojulikana (Unknown type)' }, { status: 400 });
  } catch (error) {
    console.error('Admin content action error:', error);
    return NextResponse.json(
      { error: 'Hitilafu ya seva (Server error)' },
      { status: 500 }
    );
  }
}
