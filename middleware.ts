import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const token =
    req.cookies.get('__session')?.value || req.cookies.get('session')?.value;

  // Protect /admin routes only — customer pages are guest-only
  const isProtectedRoute =
    url.pathname.startsWith('/admin') && url.pathname !== '/admin/login';

  if (isProtectedRoute && !token) {
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

