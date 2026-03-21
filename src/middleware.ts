import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/next-auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const session = await auth();

    if (!session?.user) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!session.user.isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  const response = NextResponse.next();

  // Set anonymous ID cookie if not present (for server-side tracking)
  if (!request.cookies.get('mkd_anon_id')) {
    const anonId = crypto.randomUUID();
    response.cookies.set('mkd_anon_id', anonId, {
      httpOnly: false, // Accessible by client JS to sync with localStorage
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Run on admin routes
    '/admin/:path*',
    // Run on all routes for cookie setting, but exclude static/api/auth
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
