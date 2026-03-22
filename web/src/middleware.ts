import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Set anonymous ID cookie if not present
  if (!request.cookies.get('mkd_anon_id')) {
    const anonId = crypto.randomUUID();
    response.cookies.set('mkd_anon_id', anonId, {
      httpOnly: false,
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
    // Run on all routes except static files, API auth
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
