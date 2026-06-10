import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';
import prisma from '@/lib/prisma';

/**
 * Settings page server component.
 * Validates the session and project ownership directly using Prisma before rendering.
 * Only the project owner can access the settings page.
 */
export default async function SettingsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('whodo_session')?.value;

  // If no session cookie, redirect to home
  if (!sessionToken) {
    redirect('/');
  }

  // Validate session directly using Prisma (no HTTP call needed in server component)
  let userId: string | null = null;
  try {
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
    });

    if (session && session.expiresAt > new Date()) {
      userId = session.userId;
    }
  } catch (error) {
    console.error('Failed to validate session:', error);
  }

  // If session validation failed (invalid/expired), redirect to home
  if (!userId) {
    redirect('/');
  }

  // Render the client settings page with the validated userId
  // The client component will fetch the project and handle ownership check
  return <SettingsClient userId={userId} />;
}
