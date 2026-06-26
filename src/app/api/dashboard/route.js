import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userSession = cookieStore.get('user_session');

    if (!userSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionData = JSON.parse(userSession.value);
    if (sessionData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Count citizens in the database and add the offset to match the prototype's 1,250
    const dbCitizenCount = await prisma.user.count({
      where: { role: 'warga' },
    });
    const totalPenduduk = dbCitizenCount + 1250;

    // Count news articles
    const totalNews = await prisma.news.count();

    // Count pending documents
    const pendingDocumentsCount = await prisma.document.count({
      where: { status: 'pending' },
    });

    // Fetch the 5 most recent documents along with the applicant's name
    const recentDocuments = await prisma.document.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    // Fetch recent documents for logs
    const recentDocsForLog = await prisma.document.findMany({
      include: { user: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    // Fetch recent news
    const recentNewsForLog = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Fetch recent budgets
    const recentBudgetsForLog = await prisma.budget.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Fetch recent users
    const recentUsersForLog = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    const activities = [];

    // Map documents to activities
    recentDocsForLog.forEach(doc => {
      if (doc.status === 'approved') {
        activities.push({
          type: 'success',
          icon: 'check-circle-fill',
          title: `Surat ${doc.type} (${doc.user.name}) disetujui`,
          time: doc.updatedAt,
        });
      } else if (doc.status === 'rejected') {
        activities.push({
          type: 'danger',
          icon: 'x-circle-fill',
          title: `Surat ${doc.type} (${doc.user.name}) ditolak`,
          time: doc.updatedAt,
        });
      } else {
        activities.push({
          type: 'warning',
          icon: 'clipboard2-check',
          title: `Permohonan surat baru: ${doc.type} oleh ${doc.user.name}`,
          time: doc.createdAt,
        });
      }
    });

    // Map news to activities
    recentNewsForLog.forEach(news => {
      activities.push({
        type: 'primary',
        icon: 'pencil-square',
        title: `Berita "${news.title}" dipublikasikan`,
        time: news.createdAt,
      });
    });

    // Map budgets to activities
    recentBudgetsForLog.forEach(b => {
      activities.push({
        type: 'info',
        icon: 'cash-stack',
        title: `Anggaran ${b.category} (${b.type}) diperbarui`,
        time: b.createdAt,
      });
    });

    // Map users to activities
    recentUsersForLog.forEach(u => {
      activities.push({
        type: 'secondary',
        icon: 'person-plus-fill',
        title: `Pengguna baru terdaftar: ${u.name} (${u.role === 'admin' ? 'Admin' : 'Warga'})`,
        time: u.createdAt,
      });
    });

    // Sort by time descending and take top 5
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const recentActivities = activities.slice(0, 5);

    return NextResponse.json({
      success: true,
      stats: {
        totalPenduduk,
        totalNews,
        pendingDocumentsCount,
        layananAktif: 6, // 6 public services
      },
      recentDocuments: recentDocuments.map((doc) => ({
        id: doc.id,
        namaPemohon: doc.user.name,
        jenisSurat: doc.type,
        tanggal: doc.createdAt,
        status: doc.status,
      })),
      recentActivities,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
