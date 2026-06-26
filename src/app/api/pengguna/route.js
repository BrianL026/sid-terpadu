import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

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

    // Fetch all users
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
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

    const { nik, name, email, role, address, dusun } = await request.json();

    if (!nik || !name || !email || !role) {
      return NextResponse.json(
        { error: 'NIK, Nama, Email, dan Role wajib diisi' },
        { status: 400 }
      );
    }

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

    // Generate a random 8-character temp password
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let tempPassword = '';
    for (let i = 0; i < 8; i++) {
      tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newUser = await prisma.user.create({
      data: {
        nik,
        name,
        email,
        password: hashPassword(tempPassword),
        role,
        status: 'approved', // Admin creations are approved by default
        address: address || null,
        dusun: dusun || null,
      },
    });

    return NextResponse.json({
      success: true,
      user: newUser,
      tempPassword, // Return the generated plaintext password so the admin can copy it
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
