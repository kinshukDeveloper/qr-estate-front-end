import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = [
  '/dashboard', '/listings', '/qr', '/analytics', '/leads',
  '/billing', '/settings', '/callbacks', '/brand', '/portal',
  '/optimizer', '/builder',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get('qr_estate_auth');
  const isAuthenticated = !!authCookie?.value;

  // Only block unauthenticated users from protected routes.
  // We deliberately do NOT redirect authenticated users away from
  // /auth/login or /auth/register here — that redirect is handled
  // client-side in those pages after Zustand hydrates, so the
  // cookie is never stale-checked on the server.
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/listings/:path*',
    '/qr/:path*',
    '/analytics/:path*',
    '/leads/:path*',
    '/billing/:path*',
    '/settings/:path*',
    '/callbacks/:path*',
    '/brand/:path*',
    '/portal/:path*',
    '/optimizer/:path*',
    '/builder/:path*',
    '/auth/:path*',
  ],
};
