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
    
    // Get all documents submitted by this user
    const documents = await prisma.document.findMany({
      where: {
        userId: sessionData.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error('Error fetching citizen documents:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const userSession = cookieStore.get('user_session');
    
    if (!userSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionData = JSON.parse(userSession.value);
    const { type, notes, attachmentUrl } = await request.json();

    if (!type || !notes) {
      return NextResponse.json(
        { error: 'Tipe dokumen dan keterangan harus diisi' },
        { status: 400 }
      );
    }

    // Create new document request linked to logged-in user
    const document = await prisma.document.create({
      data: {
        userId: sessionData.id,
        type,
        notes,
        attachmentUrl: attachmentUrl || null,
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error('Error creating document request:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
