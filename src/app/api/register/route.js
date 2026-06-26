import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const { nik, name, email, password, confirmPassword } = await request.json();
    
    if (!nik || !name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Semua kolom wajib diisi' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Konfirmasi password tidak cocok' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Alamat email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Check if NIK already exists
    const existingNik = await prisma.user.findUnique({
      where: { nik },
    });
    if (existingNik) {
      return NextResponse.json(
        { error: 'NIK sudah terdaftar' },
        { status: 400 }
      );
    }

    // Create the user (role default is warga, status is pending)
    const newUser = await prisma.user.create({
      data: {
        nik,
        name,
        email,
        password: hashPassword(password),
        role: 'warga',
        status: 'pending',
        address: null,
        dusun: null,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
