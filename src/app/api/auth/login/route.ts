import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';
import { limitLogin } from '@/lib/rateLimit';
import { generateCsrfToken, createCsrfCookie } from '@/lib/csrf';

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

    // Check rate limit (placeholder - always allows in current implementation)
    const { allowed } = limitLogin(ip, username);
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
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session and get token
    const sessionToken = await createSession(user.id);

    // Generate CSRF token
    const csrfToken = generateCsrfToken();

    // Create response with user data
    const response = NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    // Set session cookie (HttpOnly, Secure, SameSite=Strict)
    const sessionCookie = `whodo_session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${24 * 60 * 60}`;
    response.headers.set('Set-Cookie', sessionCookie);

    // Set CSRF cookie (not HttpOnly so JS can read it)
    response.headers.append('Set-Cookie', createCsrfCookie(csrfToken));

    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    );
  }
}
