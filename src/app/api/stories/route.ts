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
    if (projectId) {
      const stories = await prisma.story.findMany({
        where: { projectId },
        orderBy: { createdAt: 'asc' },
      });
      return NextResponse.json(stories);
    }

    const stories = await prisma.story.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stories' },
      { status: 500 }
    );
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

  try {
    const body = await request.json();

    if (!body.projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    const newStory = await prisma.story.create({
      data: {
        title: body.title || 'New Story',
        assignee: body.assignee || 'none',
        points: body.points || 'unestimated',
        isFinished: body.isFinished || false,
        isDelivered: body.isDelivered || false,
        isRejected: body.isRejected || false,
        isAccepted: body.isAccepted || false,
        mentor: body.mentor || '',
        secondaryAssignee: body.secondaryAssignee || '',
        secondaryMentor: body.secondaryMentor || '',
        aTeamSupportTime: body.aTeamSupportTime || '',
        standupComments: body.standupComments || '',
        sessionAndPMComments: body.sessionAndPMComments || '',
        dateCreated: body.dateCreated || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        type: body.type || 'feature',
        status: body.status || 'current_iteration',
        projectId: body.projectId,
      },
    });

    return NextResponse.json(newStory, { status: 201 });
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  // Check session - require auth for this protected route
  const userId = await getSessionUserId(request);
  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'story id is required' },
        { status: 400 }
      );
    }

    const updatedStory = await prisma.story.update({
      where: { id: body.id },
      data: {
        title: body.title,
        assignee: body.assignee,
        points: body.points,
        isFinished: body.isFinished,
        isDelivered: body.isDelivered,
        isRejected: body.isRejected,
        isAccepted: body.isAccepted,
        mentor: body.mentor,
        secondaryAssignee: body.secondaryAssignee,
        secondaryMentor: body.secondaryMentor,
        aTeamSupportTime: body.aTeamSupportTime,
        standupComments: body.standupComments,
        sessionAndPMComments: body.sessionAndPMComments,
        dateCreated: body.dateCreated,
        type: body.type,
        status: body.status,
      },
    });

    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 }
    );
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

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    if (!id) {
      return NextResponse.json(
        { error: 'story id is required' },
        { status: 400 }
      );
    }

    await prisma.story.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json(
      { error: 'Failed to delete story' },
      { status: 500 }
    );
  }
}
