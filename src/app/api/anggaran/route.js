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

    // Fetch all budget items
    const budgets = await prisma.budget.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      budgets,
    });
  } catch (error) {
    console.error('Error fetching budgets:', error);
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

    const { type, category, amount, description, year } = await request.json();

    if (!type || !category || amount === undefined || !description || !year) {
      return NextResponse.json(
        { error: 'Semua kolom (Tipe, Kategori, Jumlah, Deskripsi, Tahun) wajib diisi' },
        { status: 400 }
      );
    }

    if (type !== 'pendapatan' && type !== 'belanja') {
      return NextResponse.json(
        { error: 'Tipe anggaran harus berupa "pendapatan" atau "belanja"' },
        { status: 400 }
      );
    }

    const parsedAmount = parseFloat(amount);
    const parsedYear = parseInt(year);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: 'Jumlah anggaran harus berupa angka positif' },
        { status: 400 }
      );
    }

    if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
      return NextResponse.json(
        { error: 'Tahun anggaran tidak valid' },
        { status: 400 }
      );
    }

    const newBudget = await prisma.budget.create({
      data: {
        type,
        category,
        amount: parsedAmount,
        description,
        year: parsedYear,
      },
    });

    return NextResponse.json({
      success: true,
      budget: newBudget,
    });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
