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
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status') || 'all';

  try {
    const where: Record<string, unknown> = {};

    if (status !== 'all') {
      where.status = status.toUpperCase();
    }

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          reporter: {
            select: {
              id: true,
              anonymousId: true,
              username: true,
            },
          },
        },
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.report.count({ where }),
    ]);

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin reports error:', error);
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
    const { reportId, action, reason } = body;

    if (!reportId || !action) {
      return NextResponse.json(
        { error: 'reportId na action zinahitajika (reportId and action required)' },
        { status: 400 }
      );
    }

    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) {
      return NextResponse.json({ error: 'Ripoti haijapatikana (Report not found)' }, { status: 404 });
    }

    let updatedReport;

    switch (action) {
      case 'resolve':
        updatedReport = await prisma.report.update({
          where: { id: reportId },
          data: {
            status: 'RESOLVED',
            reviewedBy: admin.id,
            reviewedAt: new Date(),
            resolution: reason || 'Imetatuliwa na Admin',
          },
        });
        break;

      case 'dismiss':
        updatedReport = await prisma.report.update({
          where: { id: reportId },
          data: {
            status: 'DISMISSED',
            reviewedBy: admin.id,
            reviewedAt: new Date(),
            resolution: reason || 'Imeondolewa na Admin',
          },
        });
        break;

      case 'reviewing':
        updatedReport = await prisma.report.update({
          where: { id: reportId },
          data: {
            status: 'REVIEWING',
            reviewedBy: admin.id,
          },
        });
        break;

      case 'ban_user':
        // Ban the reported user if target is a user
        if (report.targetType === 'user') {
          await prisma.user.update({
            where: { id: report.targetId },
            data: { isBanned: true, banReason: reason || 'Umezuiwa kutokana na ripoti' },
          });
        }
        updatedReport = await prisma.report.update({
          where: { id: reportId },
          data: {
            status: 'RESOLVED',
            reviewedBy: admin.id,
            reviewedAt: new Date(),
            resolution: 'Mtumiaji amezuiwa (User banned)',
          },
        });
        break;

      case 'remove_content':
        // Remove the reported content
        if (report.targetType === 'vote') {
          await prisma.vote.update({
            where: { id: report.targetId },
            data: { status: 'REMOVED', isActive: false },
          });
        } else if (report.targetType === 'rating') {
          await prisma.rating.update({
            where: { id: report.targetId },
            data: { status: 'REMOVED', isActive: false },
          });
        }
        updatedReport = await prisma.report.update({
          where: { id: reportId },
          data: {
            status: 'RESOLVED',
            reviewedBy: admin.id,
            reviewedAt: new Date(),
            resolution: 'Maudhui yameondolewa (Content removed)',
          },
        });
        break;

      default:
        return NextResponse.json({ error: 'Kitendo kisichojulikana (Unknown action)' }, { status: 400 });
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: `report_${action}`,
        target: 'report',
        targetId: reportId,
        oldData: { status: report.status },
        newData: { status: updatedReport.status },
      },
    });

    return NextResponse.json({ report: updatedReport });
  } catch (error) {
    console.error('Admin report action error:', error);
    return NextResponse.json(
      { error: 'Hitilafu ya seva (Server error)' },
      { status: 500 }
    );
  }
}
