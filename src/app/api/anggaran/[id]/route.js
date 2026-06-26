import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

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

    // Check if the budget item exists
    const existingBudget = await prisma.budget.findUnique({
      where: { id },
    });

    if (!existingBudget) {
      return NextResponse.json(
        { error: 'Anggaran tidak ditemukan' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { type, category, amount, description, year } = body;

    const updateData = {};
    
    if (type !== undefined) {
      if (type !== 'pendapatan' && type !== 'belanja') {
        return NextResponse.json(
          { error: 'Tipe anggaran harus berupa "pendapatan" atau "belanja"' },
          { status: 400 }
        );
      }
      updateData.type = type;
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return NextResponse.json(
          { error: 'Jumlah anggaran harus berupa angka positif' },
          { status: 400 }
        );
      }
      updateData.amount = parsedAmount;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (year !== undefined) {
      const parsedYear = parseInt(year);
      if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
        return NextResponse.json(
          { error: 'Tahun anggaran tidak valid' },
          { status: 400 }
        );
      }
      updateData.year = parsedYear;
    }

    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      budget: updatedBudget,
    });
  } catch (error) {
    console.error('Error updating budget:', error);
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

    // Check if the budget item exists
    const existingBudget = await prisma.budget.findUnique({
      where: { id },
    });

    if (!existingBudget) {
      return NextResponse.json(
        { error: 'Anggaran tidak ditemukan' },
        { status: 404 }
      );
    }

    await prisma.budget.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Anggaran berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
