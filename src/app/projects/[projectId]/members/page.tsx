import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import MembersClient from './MembersClient';
import prisma from '@/lib/prisma';

/**
 * Members page server component.
 * Validates the session directly using Prisma before rendering.
 * This runs in Node.js runtime (not Edge) so Prisma is available.
 */
export default async function MembersPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('whodo_session')?.value;

  // If no session cookie, redirect to home
  if (!sessionToken) {
    redirect('/');
  }

  // Validate session directly using Prisma (no HTTP call needed in server component)
  let username: string | null = null;
  try {
    const session = await prisma.session.findUnique({
      where: { token: sessionToken },
    });

    if (session && session.expiresAt > new Date()) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { username: true },
      });
      username = user?.username ?? null;
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
