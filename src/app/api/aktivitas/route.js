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

    // Fetch larger chunk of recent items for full log (e.g. 30 items of each type)
    const recentDocsForLog = await prisma.document.findMany({
      include: { user: true },
      orderBy: { updatedAt: 'desc' },
      take: 30,
    });

    const recentNewsForLog = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    const recentBudgetsForLog = await prisma.budget.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    const recentUsersForLog = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    const activities = [];

    // Map documents to activities
    recentDocsForLog.forEach(doc => {
      if (doc.status === 'approved') {
        activities.push({
          id: `doc-app-${doc.id}`,
          type: 'success',
          icon: 'check-circle-fill',
          category: 'Surat',
          title: `Surat ${doc.type} (${doc.user.name}) disetujui`,
          time: doc.updatedAt,
        });
      } else if (doc.status === 'rejected') {
        activities.push({
          id: `doc-rej-${doc.id}`,
          type: 'danger',
          icon: 'x-circle-fill',
          category: 'Surat',
          title: `Surat ${doc.type} (${doc.user.name}) ditolak`,
          time: doc.updatedAt,
        });
      } else {
        activities.push({
          id: `doc-pend-${doc.id}`,
          type: 'warning',
          icon: 'clipboard2-check',
          category: 'Surat',
          title: `Permohonan surat baru: ${doc.type} oleh ${doc.user.name}`,
          time: doc.createdAt,
        });
      }
    });

    // Map news to activities
    recentNewsForLog.forEach(news => {
      activities.push({
        id: `news-${news.id}`,
        type: 'primary',
        icon: 'pencil-square',
        category: 'Berita',
        title: `Berita "${news.title}" dipublikasikan`,
        time: news.createdAt,
      });
    });

    // Map budgets to activities
    recentBudgetsForLog.forEach(b => {
      activities.push({
        id: `budget-${b.id}`,
        type: 'info',
        icon: 'cash-stack',
        category: 'Anggaran',
        title: `Anggaran ${b.category} (${b.type}) diperbarui`,
        time: b.createdAt,
      });
    });

    // Map users to activities
    recentUsersForLog.forEach(u => {
      activities.push({
        id: `user-${u.id}`,
        type: 'secondary',
        icon: 'person-plus-fill',
        category: 'Pengguna',
        title: `Pengguna baru terdaftar: ${u.name} (${u.role === 'admin' ? 'Admin' : 'Warga'})`,
        time: u.createdAt,
      });
    });

    // Sort by time descending and take top 100
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const allActivities = activities.slice(0, 100);

    return NextResponse.json({
      success: true,
      activities: allActivities,
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
