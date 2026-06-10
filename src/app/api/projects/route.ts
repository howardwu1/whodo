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
  const id = searchParams.get('id');

  try {
    // If id is provided, fetch a single project
    if (id) {
      const project = await prisma.project.findUnique({
        where: { id: id },
        include: {
          stories: true,
          members: {
            include: {
              user: { select: { id: true, username: true, email: true } }
            }
          }
        },
      });

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      // Fetch the owner username separately since Project has userId but not user relation
      const owner = await prisma.user.findUnique({
        where: { id: project.userId },
        select: { username: true }
      });

      return NextResponse.json({
        project: {
          id: project.id,
          name: project.name,
          createdAt: project.createdAt,
          userId: project.userId,
          ownerUsername: owner?.username ?? 'Unknown',
          velocity: project.velocity as number[],
          target: project.target as number[],
          health: project.health,
          isPrivate: project.isPrivate,
          isFavorite: project.isFavorite,
        }
      });
    }

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

export async function DELETE(request: Request) {
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
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Check project ownership - only the owner can delete
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.userId !== userId) {
      return NextResponse.json(
        { error: 'Only the project owner can delete this project' },
        { status: 403 }
      );
    }

    // Delete the project (cascades to stories and members due to onDelete: Cascade)
    await prisma.project.delete({
      where: { id: projectId }
    });

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
