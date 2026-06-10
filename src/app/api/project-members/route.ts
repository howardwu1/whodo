import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateSession } from '@/lib/session';

/**
 * Get and validate session from request cookies.
 * Returns userId if valid, null otherwise.
 */
async function getSessionUserId(request: Request): Promise<string | null> {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [key, ...val] = c.split('=');
      return [key, val.join('=')];
    })
  );
  const sessionToken = cookies['whodo_session'];
  return validateSession(sessionToken ?? '');
}

// GET - Get project members
export async function GET(request: Request) {
  // Check session - require auth for this protected route
  const userId = await getSessionUserId(request);
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  try {
    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true, username: true, email: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching project members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

// POST - Add member to project
export async function POST(request: Request) {
  // Check session - require auth for this protected route
  const authUserId = await getSessionUserId(request);
  if (!authUserId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    let user;
    
    // Find user by username or userId
    if (body.username) {
      user = await prisma.user.findUnique({
        where: { username: body.username }
      });
    } else if (body.userId) {
      user = await prisma.user.findUnique({
        where: { id: body.userId }
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if already a member
    const existing = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: body.projectId
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'User is already a member' }, { status: 400 });
    }

    const member = await prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId: body.projectId,
        role: body.role || 'member'
      },
      include: {
        user: {
          select: { id: true, username: true, email: true }
        }
      }
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error adding project member:', error);
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }
}

// DELETE - Remove member from project
export async function DELETE(request: Request) {
  // Check session - require auth for this protected route
  const authUserId = await getSessionUserId(request);
  if (!authUserId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  const userId = searchParams.get('userId');

  try {
    if (!projectId || !userId) {
      return NextResponse.json({ error: 'projectId and userId are required' }, { status: 400 });
    }

    await prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId,
          projectId
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing project member:', error);
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }
}
