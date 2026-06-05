import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (username) {
      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          projects: {
            include: { stories: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
      return NextResponse.json(user);
    }

    const users = await prisma.user.findMany({
      include: {
        projects: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
      },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
