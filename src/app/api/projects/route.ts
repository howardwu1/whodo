import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Project {
  id: string;
  name: string;
  isFavorite: boolean;
  isPrivate: boolean;
  velocity: number[];
  target: number[];
  health: string;
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        stories: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to match frontend interface if needed
    const transformedProjects = projects.map((project) => ({
      ...project,
      id: project.id, // Keep as string for database ID
      velocity: project.velocity as number[],
      target: project.target as number[],
    }));

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProject = await prisma.project.create({
      data: {
        name: body.name || 'New Project',
        isPrivate: body.isPrivate ?? true,
        isFavorite: false,
        velocity: body.velocity || [0],
        target: body.target || [0],
        health: 'green',
        userId: body.userId || null,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
