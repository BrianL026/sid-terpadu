import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userSession = cookieStore.get('user_session');

    if (!userSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionData = JSON.parse(userSession.value);
    if (sessionData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, category, imageUrl } = body;

    // Check if the news article exists
    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: 'Berita tidak ditemukan' },
        { status: 404 }
      );
    }

    const updateData = {};
    if (title !== undefined) {
      updateData.title = title;
      
      // If title changed, update slug
      if (title !== existingNews.title) {
        let slug = generateSlug(title);
        let originalSlug = slug;
        let counter = 1;
        while (true) {
          const existing = await prisma.news.findUnique({
            where: { slug },
          });
          // Allow using its own existing slug or a new unique slug
          if (!existing || existing.id === id) break;
          slug = `${originalSlug}-${counter}`;
          counter++;
        }
        updateData.slug = slug;
      }
    }

    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;

    const updatedNews = await prisma.news.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      news: updatedNews,
    });
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userSession = cookieStore.get('user_session');

    if (!userSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionData = JSON.parse(userSession.value);
    if (sessionData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if the news article exists
    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: 'Berita tidak ditemukan' },
        { status: 404 }
      );
    }

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Berita berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
