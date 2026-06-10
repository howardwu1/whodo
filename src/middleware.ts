import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to handle session cookie presence for protected routes.
 * 
 * IMPORTANT: This middleware runs in Edge runtime and CANNOT use Prisma.
 * We only check for cookie presence here - actual session validation
 * happens in server components/pages where Prisma is available.
 * 
 * - /dashboard: redirects to / if no session cookie present (no DB call)
 * - /api/*: returns 401 if no session cookie, sets X-User-Id header if present
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get session token from cookie - just check presence, no DB validation
  const sessionToken = request.cookies.get('whodo_session')?.value;
  const hasSession = !!sessionToken;

  if (pathname.startsWith('/api/')) {
    // API routes: return 401 if no session cookie
    if (!hasSession) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    // Set X-User-Id header if cookie present (actual validation happens in route handler)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', 'cookie-present');
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (pathname === '/dashboard') {
    // Dashboard: redirect to / if no session cookie (no DB call in Edge runtime)
    if (!hasSession) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Set X-User-Id header - actual session validation happens in page server component
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', 'cookie-present');
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/api/*'],
};
