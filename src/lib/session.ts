import { v4 as uuidv4 } from 'uuid';
import { prisma } from './prisma';

/**
 * Creates a new session for the given user.
 * Generates a UUID v4 token, creates a DB record with 24h expiry, and returns the token.
 * 
 * @param userId - The ID of the user to create a session for
 * @returns The generated session token (UUID v4)
 */
export async function createSession(userId: string): Promise<string> {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return token;
}

/**
 * Validates a session token.
 * Looks up the token in the DB, checks expiry, and returns the userId if valid.
 * 
 * @param token - The session token to validate
 * @returns The userId if valid and not expired, null otherwise
 */
export async function validateSession(token: string): Promise<string | null> {
  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
  });

  if (!session) {
    return null;
  }

  // Check if session has expired
  if (session.expiresAt < new Date()) {
    return null;
  }

  return session.userId;
}

/**
 * Deletes a session from the DB.
 * 
 * @param token - The session token to delete
 */
export async function deleteSession(token: string): Promise<void> {
  await prisma.session.delete({
    where: { token },
  }).catch(() => {
    // Session may not exist, which is fine for delete operations
  });
}

/**
 * Cleans up all expired sessions from the DB.
 * Deletes all records where expiresAt is in the past.
 * 
 * @returns The number of deleted sessions
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}
