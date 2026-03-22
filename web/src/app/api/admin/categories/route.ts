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
    const categories = await prisma.category.findMany({
      orderBy: { position: 'asc' },
      include: {
        _count: {
          select: {
            votes: true,
            ratings: true,
          },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Admin categories error:', error);
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
    const { action } = body;

    if (action === 'update') {
      const { id, name, nameEn, icon, color, description, isActive } = body;

      if (!id) {
        return NextResponse.json({ error: 'ID inahitajika (ID required)' }, { status: 400 });
      }

      const category = await prisma.category.findUnique({ where: { id } });
      if (!category) {
        return NextResponse.json({ error: 'Kundi halijapatikana (Category not found)' }, { status: 404 });
      }

      const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(nameEn !== undefined && { nameEn }),
          ...(icon !== undefined && { icon }),
          ...(color !== undefined && { color }),
          ...(description !== undefined && { description }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      await prisma.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'category_update',
          target: 'category',
          targetId: id,
          oldData: { name: category.name, nameEn: category.nameEn, icon: category.icon, color: category.color, isActive: category.isActive },
          newData: { name: updatedCategory.name, nameEn: updatedCategory.nameEn, icon: updatedCategory.icon, color: updatedCategory.color, isActive: updatedCategory.isActive },
        },
      });

      return NextResponse.json({ category: updatedCategory });
    }

    if (action === 'reorder') {
      const { orderedIds } = body;

      if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
        return NextResponse.json({ error: 'orderedIds zinahitajika (orderedIds required)' }, { status: 400 });
      }

      // Update positions in a transaction
      await prisma.$transaction(
        orderedIds.map((id: string, index: number) =>
          prisma.category.update({
            where: { id },
            data: { position: index },
          })
        )
      );

      await prisma.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'category_reorder',
          target: 'category',
          targetId: 'bulk',
          newData: { orderedIds },
        },
      });

      return NextResponse.json({ success: true });
    }

    if (action === 'create') {
      const { name, nameEn, slug, icon, color, description } = body;

      if (!name || !nameEn || !slug || !icon || !color) {
        return NextResponse.json(
          { error: 'name, nameEn, slug, icon, na color zinahitajika' },
          { status: 400 }
        );
      }

      const maxPosition = await prisma.category.aggregate({ _max: { position: true } });
      const newPosition = (maxPosition._max.position ?? -1) + 1;

      const category = await prisma.category.create({
        data: {
          name,
          nameEn,
          slug,
          icon,
          color,
          description: description || null,
          position: newPosition,
        },
      });

      await prisma.auditLog.create({
        data: {
          adminId: admin.id,
          action: 'category_create',
          target: 'category',
          targetId: category.id,
          newData: { name, nameEn, slug, icon, color },
        },
      });

      return NextResponse.json({ category });
    }

    return NextResponse.json({ error: 'Kitendo kisichojulikana (Unknown action)' }, { status: 400 });
  } catch (error) {
    console.error('Admin category action error:', error);
    return NextResponse.json(
      { error: 'Hitilafu ya seva (Server error)' },
      { status: 500 }
    );
  }
}
