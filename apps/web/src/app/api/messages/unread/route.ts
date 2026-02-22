import { NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const count = await prisma.message.count({
      where: {
        toId: profile.id,
        read: false,
      },
    });

    return NextResponse.json({ data: { count } });
  } catch (error) {
    console.error('[GET /api/messages/unread]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
