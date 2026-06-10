'use server';

import { cookies } from 'next/headers';
import { deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

/**
 * Server action to log out the current user.
 * Clears the session cookie and redirects to the login page.
 */
export async function logout() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('whodo_session')?.value;

  // Delete session from database if token exists
  if (sessionToken) {
    await deleteSession(sessionToken);
  }

  // Clear the session cookie
  cookieStore.set('whodo_session', '', {
    expires: new Date(0),
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  // Clear the CSRF cookie as well
  cookieStore.set('whodo_csrf', '', {
    expires: new Date(0),
    path: '/',
  });

  // Redirect to login page
  redirect('/login');
}

/**
 * Server action to clear the session cookies without redirecting.
 * Useful for when you want to clear session but handle the redirect client-side.
 */
export async function clearSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('whodo_session')?.value;

  // Delete session from database if token exists
  if (sessionToken) {
    await deleteSession(sessionToken);
  }

  // Clear the session cookie
  cookieStore.set('whodo_session', '', {
    expires: new Date(0),
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  // Clear the CSRF cookie as well
  cookieStore.set('whodo_csrf', '', {
    expires: new Date(0),
    path: '/',
  });
}
