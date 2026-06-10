import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateSession } from '@/lib/session';
import { validateCsrfToken } from '@/lib/csrf';

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

/**
 * Extracts the session token from request cookies.
 */
function getSessionToken(request: Request): string {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [key, ...val] = c.split('=');
      return [key, val.join('=')];
    })
  );
  return cookies['whodo_session'] ?? '';
}

/**
 * Validates CSRF token for mutating requests.
 * Returns true if valid, false if missing or mismatched.
 */
async function validateCsrf(request: Request): Promise<boolean> {
  const csrfToken = request.headers.get('x-csrf-token');
  if (!csrfToken) {
    return false;
  }
  const sessionToken = getSessionToken(request);
  return validateCsrfToken(sessionToken, csrfToken);
}

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
  const username = searchParams.get('username');

  try {
    let projects;

    if (username) {
      // Get the user's ID from username
      const user = await prisma.user.findUnique({
        where: { username: username }
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Get projects where user is a member or owner
      projects = await prisma.project.findMany({
        where: {
          OR: [
            { userId: user.id },
            { members: { some: { user: { username } } } }
          ]
        },
        include: {
          stories: true,
          members: {
            include: {
              user: { select: { id: true, username: true, email: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      projects = await prisma.project.findMany({
        include: {
          stories: true,
          members: {
            include: {
              user: { select: { id: true, username: true, email: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    const transformedProjects = projects.map((project) => ({
      ...project,
      id: project.id,
      velocity: project.velocity as number[],
      target: project.target as number[],
    }));

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Check session - require auth for this protected route
  const userId = await getSessionUserId(request);
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Validate CSRF token
  const isValidCsrf = await validateCsrf(request);
  if (!isValidCsrf) {
    return NextResponse.json(
      { error: 'CSRF token missing or invalid' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    if (!body.userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Find user to get their ID
    const user = await prisma.user.findUnique({
      where: { username: body.userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newProject = await prisma.project.create({
      data: {
        name: body.name || 'New Project',
        isPrivate: body.isPrivate ?? true,
        isFavorite: false,
        velocity: body.velocity || [0],
        target: body.target || [0],
        health: 'green',
        userId: user.id,  // Store the actual user ID, not username
        members: {
          create: {
            userId: user.id,
            role: 'owner'
          }
        }
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, username: true, email: true } }
          }
        }
      }
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
