import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-space, non-dash
    .replace(/[\s_-]+/g, '-') // replace spaces and underscores with a single dash
    .replace(/^-+|-+$/g, ''); // remove leading and trailing dashes
}

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

    // Fetch all news with author info
    const newsList = await prisma.news.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      news: newsList,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
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
    if (sessionData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, content, category, imageUrl } = await request.json();

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Judul, konten, dan kategori wajib diisi' },
        { status: 400 }
      );
    }

    let slug = generateSlug(title);

    // Ensure slug is unique
    let originalSlug = slug;
    let counter = 1;
    while (true) {
      const existing = await prisma.news.findUnique({
        where: { slug },
      });
      if (!existing) break;
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    const newNews = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        category,
        imageUrl: imageUrl || null,
        authorId: sessionData.id,
      },
    });

    return NextResponse.json({
      success: true,
      news: newNews,
    });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
