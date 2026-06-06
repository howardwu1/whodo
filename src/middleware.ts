import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect /dashboard route
  if (request.nextUrl.pathname === '/dashboard') {
    // Check for username cookie or localStorage check
    // Since we can't access localStorage from middleware, we need to pass auth via cookie
    const usernameCookie = request.cookies.get('whodo_username');

    if (!usernameCookie || usernameCookie.value === '') {
      // Redirect to home page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'],
};
