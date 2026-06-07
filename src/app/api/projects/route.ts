import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  try {
    let projects;

    if (username) {
      // Get projects where user is a member or owner
      projects = await prisma.project.findMany({
        where: {
          OR: [
            { userId: username },
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
        userId: body.userId,
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
