import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists and password matches
    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 400 }
      );
    }

    // Check if user is approved
    if (user.status === 'pending') {
      return NextResponse.json(
        { error: 'Akun Anda belum disetujui oleh admin. Silakan hubungi perangkat desa.' },
        { status: 403 }
      );
    } else if (user.status === 'rejected') {
      return NextResponse.json(
        { error: 'Pendaftaran akun Anda ditolak oleh admin.' },
        { status: 403 }
      );
    }

    // Return success response with user profile details and set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nik: user.nik,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set('user_session', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
