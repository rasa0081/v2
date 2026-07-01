import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const publicPaths = [
    '/admin',
    '/admin/login',
    '/api/admin/login',
    '/api/admin/logout',
    '/api/admin/verify'
  ];

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin/')) {
    const token = request.cookies.get('adminToken')?.value;
    const authFlag = request.cookies.get('adminAuth')?.value;

    if (!token || authFlag !== 'true') {
      if (pathname.startsWith('/api/admin/')) {
        return NextResponse.json(
          { success: false, error: 'دسترسی غیرمجاز' },
          { status: 401 }
        );
      }

      const loginUrl = new URL('/admin', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};