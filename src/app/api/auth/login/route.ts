import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';
import { checkLoginLimit, recordFailedLogin } from '@/lib/rateLimit';

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

    // Set cookies using Next.js cookies() API for consistent attributes
    const cookieStore = await cookies();

    // Set session cookie (HttpOnly, SameSite=Lax, Path=/, MaxAge=86400)
    cookieStore.set('whodo_session', sessionToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 86400,
    });

    // Set CSRF cookie (not HttpOnly so JS can read it, SameSite=Lax, Path=/, MaxAge=86400)
    cookieStore.set('whodo_csrf', csrfSecret, {
      path: '/',
      sameSite: 'lax',
      maxAge: 86400,
    });

    // Create response with user data
    const response = NextResponse.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { error: 'Failed to log in' },
      { status: 500 }
    );
  }
}
