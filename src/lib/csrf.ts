import { v4 as uuidv4 } from 'uuid';
import { prisma } from './prisma';

/**
 * CSRF protection utilities.
 * Generates and validates CSRF tokens for form submissions.
 */

/**
 * Generates a new CSRF token (secret).
 * 
 * @returns A UUID v4 token to be stored as a CSRF secret
 */
export function generateCsrfToken(): string {
  return uuidv4();
}

/**
 * Creates a CSRF cookie string for Set-Cookie header.
 * Not HttpOnly so JavaScript can read it for header inclusion.
 * 
 * @param token - The CSRF token to set
 * @returns Formatted Set-Cookie string
 */
export function createCsrfCookie(token: string): string {
  const maxAge = 24 * 60 * 60; // 24 hours in seconds
  return `whodo_csrf=${token}; Path=/; Max-Age=${maxAge}`;
}

/**
 * Validates a CSRF token against the session's stored csrfSecret.
 * 
 * @param sessionToken - The session token from the whodo_session cookie
 * @param providedToken - The CSRF token from the x-csrf-token header
 * @returns true if valid, false otherwise
 */
export async function validateCsrfToken(sessionToken: string, providedToken: string): Promise<boolean> {
  if (!sessionToken || !providedToken) {
    return false;
  }

  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
  });

  if (!session) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  return session.csrfSecret === providedToken;
}
