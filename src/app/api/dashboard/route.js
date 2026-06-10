import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
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
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
