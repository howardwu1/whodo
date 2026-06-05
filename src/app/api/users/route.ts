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

// User creation is handled via /api/auth/register
// This endpoint is for user management only
