import { NextResponse } from 'next/server';

export function proxy(request) {
  const userSession = request.cookies.get('user_session');
  const { pathname } = request.nextUrl;

  // Protect Admin Dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!userSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const user = JSON.parse(userSession.value);
      if (user.role !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect Citizen Dashboard (warga)
  if (pathname.startsWith('/warga')) {
    if (!userSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const user = JSON.parse(userSession.value);
      if (user.role !== 'warga') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/warga/:path*'],
};
