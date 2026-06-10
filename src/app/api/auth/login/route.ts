import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';
import { checkLoginLimit, recordFailedLogin } from '@/lib/rateLimit';
import { createCsrfCookie } from '@/lib/csrf';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

    // Check rate limit before credential validation
    const { allowed } = checkLoginLimit(ip, username);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Find user by username (include password for verification)
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, email: true, password: true },
    });

    if (!user) {
      // Record failed attempt for non-existent user
      recordFailedLogin(ip, username);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      // Record failed attempt for wrong password
      recordFailedLogin(ip, username);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session and get token and csrfSecret
    const { token: sessionToken, csrfSecret } = await createSession(user.id);

    // Create response with user data
    const response = NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    // Set session cookie (HttpOnly, SameSite=Strict)
    // Note: Not using Secure flag because it causes issues with cookie domain matching
    // SameSite=Strict already provides CSRF protection
    const sessionCookie = `whodo_session=${sessionToken}; HttpOnly; SameSite=Strict; Max-Age=${24 * 60 * 60}`;
    response.headers.set('Set-Cookie', sessionCookie);

    // Set CSRF cookie (not HttpOnly so JS can read it)
    response.headers.append('Set-Cookie', createCsrfCookie(csrfSecret));

    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    );
  }
}
