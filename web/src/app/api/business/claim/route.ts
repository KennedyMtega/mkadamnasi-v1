import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateAnonymousUser } from '@/lib/auth';
import { z } from 'zod';

const claimSchema = z.object({
  businessName: z.string().min(2, 'Jina la biashara ni fupi sana (Business name too short)').max(200),
  notes: z.string().max(1000).optional(),
  documentUrl: z.string().url('URL ya hati si sahihi (Invalid document URL)').optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateAnonymousUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unahitaji kuingia kwanza (Authentication required)' },
        { status: 401 }
      );
    }

    const claims = await prisma.businessClaim.findMany({
      where: { userId: user.id },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            isVerified: true,
            isClaimed: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      data: claims.map((c) => ({
        id: c.id,
        businessId: c.businessId,
        businessName: c.business.name,
        status: c.status,
        notes: c.notes,
        documentUrl: c.documentUrl,
        createdAt: c.createdAt,
        reviewedAt: c.reviewedAt,
      })),
      total: claims.length,
    });
  } catch (error) {
    console.error('Business claim list error:', error);
    return NextResponse.json(
      { error: 'Hitilafu ya seva (Server error)' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getOrCreateAnonymousUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unahitaji kuingia kwanza (Authentication required)' },
        { status: 401 }
      );
    }

    // Rate limiting: max 3 pending claims per user
    const pendingCount = await prisma.businessClaim.count({
      where: {
        userId: user.id,
        status: 'PENDING',
      },
    });

    if (pendingCount >= 3) {
      return NextResponse.json(
        { error: 'Umezidi idadi ya maombi yanayosubiri. Subiri yaliyopo yakaguliwe kwanza. (Too many pending claims. Wait for existing ones to be reviewed.)' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = claimSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Data si sahihi (Invalid data)' },
        { status: 400 }
      );
    }

    const { businessName, notes, documentUrl } = parsed.data;

    // Find existing business or create one
    let business = await prisma.business.findFirst({
      where: {
        name: {
          equals: businessName,
          mode: 'insensitive',
        },
      },
    });

    if (!business) {
      business = await prisma.business.create({
        data: {
          name: businessName,
          categorySlug: 'general',
        },
      });
    }

    // Check if user already has a claim for this business
    const existingClaim = await prisma.businessClaim.findFirst({
      where: {
        userId: user.id,
        businessId: business.id,
        status: { in: ['PENDING', 'APPROVED'] },
      },
    });

    if (existingClaim) {
      return NextResponse.json(
        { error: 'Tayari umeomba umiliki wa biashara hii (You already have a claim for this business)' },
        { status: 409 }
      );
    }

    const claim = await prisma.businessClaim.create({
      data: {
        businessId: business.id,
        userId: user.id,
        notes: notes || null,
        documentUrl: documentUrl || null,
      },
    });

    return NextResponse.json({
      data: {
        id: claim.id,
        businessId: business.id,
        businessName: business.name,
        status: claim.status,
        createdAt: claim.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Business claim create error:', error);
    return NextResponse.json(
      { error: 'Hitilafu ya seva (Server error)' },
      { status: 500 }
    );
  }
}
