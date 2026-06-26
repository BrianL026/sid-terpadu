import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

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

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { nik, name, email, password, role, address, dusun } = body;

    const updateData = {};

    if (nik !== undefined && nik !== existingUser.nik) {
      // Check if NIK already exists
      const existingNik = await prisma.user.findUnique({
        where: { nik },
      });
      if (existingNik) {
        return NextResponse.json(
          { error: 'NIK sudah terdaftar oleh pengguna lain' },
          { status: 400 }
        );
      }
      updateData.nik = nik;
    }

    if (email !== undefined && email !== existingUser.email) {
      // Check if Email already exists
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email sudah terdaftar oleh pengguna lain' },
          { status: 400 }
        );
      }
      updateData.email = email;
    }

    if (name !== undefined) updateData.name = name;
    if (password !== undefined && password !== existingUser.password && password.trim() !== '') {
      updateData.password = hashPassword(password);
    }
    
    if (role !== undefined) {
      // Prevent the currently logged-in admin from changing their own role to 'warga'
      if (id === sessionData.id && role !== 'admin') {
        return NextResponse.json(
          { error: 'Anda tidak dapat mengubah role Anda sendiri' },
          { status: 400 }
        );
      }
      updateData.role = role;
    }

    if (address !== undefined) updateData.address = address || null;
    if (dusun !== undefined) updateData.dusun = dusun || null;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
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

    // Prevent the currently logged-in admin from deleting themselves
    if (id === sessionData.id) {
      return NextResponse.json(
        { error: 'Anda tidak dapat menghapus akun Anda sendiri' },
        { status: 400 }
      );
    }

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Pengguna tidak ditemukan' },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Pengguna berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
