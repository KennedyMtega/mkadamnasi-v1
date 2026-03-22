import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/categories - List all active categories with counts
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
      include: {
        _count: {
          select: {
            votes: { where: { isActive: true, status: 'ACTIVE' } },
            ratings: { where: { isActive: true, status: 'ACTIVE' } },
          },
        },
      },
    });

    const data = categories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      nameEn: cat.nameEn,
      icon: cat.icon,
      color: cat.color,
      description: cat.description,
      voteCount: cat._count.votes,
      ratingCount: cat._count.ratings,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Tatizo la seva. Jaribu tena.' },
      { status: 500 }
    );
  }
}
