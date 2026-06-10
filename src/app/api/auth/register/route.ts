import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';
import { checkRegisterLimit, recordFailedRegister } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';

    // Check rate limit before proceeding with registration
    const { allowed } = checkRegisterLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email: email || null,
        password: hashedPassword,
      },
    });

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
    const response = NextResponse.json(
      { id: user.id, username: user.username, email: user.email },
      { status: 201 }
    );

    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
