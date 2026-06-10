import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateSession } from '@/lib/session';

/**
 * Middleware to validate session tokens for protected routes.
 * - /dashboard: redirects to / if no valid session
 * - /api/*: returns 401 if no valid session, sets X-User-Id header if valid
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get session token from cookie
  const sessionToken = request.cookies.get('whodo_session')?.value;

  // Validate the session
  const userId = await validateSession(sessionToken ?? '');

  if (pathname.startsWith('/api/')) {
    // API routes: return 401 if invalid session
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    // Set X-User-Id header for downstream handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userId);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (pathname === '/dashboard') {
    // Dashboard: redirect to / if invalid session
    if (!userId) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Set X-User-Id header for downstream handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userId);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'],
};
