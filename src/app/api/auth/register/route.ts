import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';
import { createCsrfCookie } from '@/lib/csrf';

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

    // Create response with user data
    const response = NextResponse.json(
      { id: user.id, username: user.username, email: user.email },
      { status: 201 }
    );

    // Set session cookie (HttpOnly, Secure, SameSite=Strict)
    const sessionCookie = `whodo_session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${24 * 60 * 60}`;
    response.headers.set('Set-Cookie', sessionCookie);

    // Set CSRF cookie (not HttpOnly so JS can read it)
    response.headers.append('Set-Cookie', createCsrfCookie(csrfSecret));

    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
