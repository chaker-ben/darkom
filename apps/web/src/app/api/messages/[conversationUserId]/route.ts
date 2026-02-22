import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ conversationUserId: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
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
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 },
      );
    }

    const { conversationUserId } = await context.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromId: profile.id, toId: conversationUserId },
          { fromId: conversationUserId, toId: profile.id },
        ],
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        fromId: true,
        toId: true,
        listingId: true,
        content: true,
        read: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: messages }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/messages/[conversationUserId]]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PATCH(_request: NextRequest, context: RouteContext) {
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
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 },
      );
    }

    const { conversationUserId } = await context.params;

    const result = await prisma.message.updateMany({
      where: {
        fromId: conversationUserId,
        toId: profile.id,
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json(
      { data: { markedRead: result.count } },
      { status: 200 },
    );
  } catch (error) {
    console.error('[PATCH /api/messages/[conversationUserId]]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
