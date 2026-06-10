'use server';

import { cookies } from 'next/headers';
import { deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

/**
 * Server action to log out the current user.
 * Clears the session cookie and redirects to the login page.
 */
export async function logout() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('whodo_session')?.value;

    // Delete session from database if token exists
    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    // Clear the session cookie (matching attributes with login/register: sameSite=lax, no secure flag)
    cookieStore.set('whodo_session', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });

    // Clear the CSRF cookie as well (matching attributes with login/register: sameSite=lax)
    cookieStore.set('whodo_csrf', '', {
      expires: new Date(0),
      path: '/',
      sameSite: 'lax',
    });
  } catch (error) {
    // Log error but still proceed to redirect
    console.error('Error during logout:', error);
  }

  // Redirect to login page - this should always happen
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

  // Clear the session cookie (matching attributes with login/register: sameSite=lax, no secure flag)
  cookieStore.set('whodo_session', '', {
    expires: new Date(0),
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });

  // Clear the CSRF cookie as well (matching attributes with login/register: sameSite=lax)
  cookieStore.set('whodo_csrf', '', {
    expires: new Date(0),
    path: '/',
    sameSite: 'lax',
  });
}
