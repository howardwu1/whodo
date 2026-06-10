import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import MembersClient from './MembersClient';

/**
 * Members page server component.
 * Validates the session via /api/auth/me before rendering.
 * This runs in Node.js runtime (not Edge) so Prisma is available.
 */
export default async function MembersPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('whodo_session')?.value;

  // If no session cookie, redirect to home
  if (!sessionToken) {
    redirect('/');
  }

  // Validate session by calling /api/auth/me
  // This uses the actual session validation with Prisma
  let username: string | null = null;
  try {
    // We need to call the API internally - create a request to /api/auth/me
    // Since we're in a server component, we can use absolute URL or call directly
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = process.env.VERCEL_URL || process.env.AUTH_TRUST_HOST || 'localhost:3000';
    const response = await fetch(`${protocol}://${host}/api/auth/me`, {
      headers: {
        Cookie: `whodo_session=${sessionToken}`,
      },
      cache: 'no-store',
    });

    if (response.ok) {
      const user = await response.json();
      username = user.username;
    }
  } catch (error) {
    console.error('Failed to validate session:', error);
  }

  // If session validation failed (invalid/expired), redirect to home
  if (!username) {
    redirect('/');
  }

  // Render the client members page with the validated username
  return <MembersClient username={username} />;
}
