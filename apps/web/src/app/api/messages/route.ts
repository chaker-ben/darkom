import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

import type { ConversationDTO } from '@/features/messages/types';
import { prisma } from '@/lib/prisma';

const createMessageSchema = z.object({
  toId: z.string().min(1),
  listingId: z.string().optional(),
  content: z.string().min(1).max(2000),
});

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
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 },
      );
    }

    const messages = await prisma.message.findMany({
      where: { OR: [{ fromId: profile.id }, { toId: profile.id }] },
      orderBy: { createdAt: 'desc' },
      include: {
        from: { select: { id: true, fullName: true, avatarUrl: true } },
        to: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    const conversationMap = new Map<string, ConversationDTO>();

    for (const msg of messages) {
      const otherUser = msg.fromId === profile.id ? msg.to : msg.from;

      if (!conversationMap.has(otherUser.id)) {
        conversationMap.set(otherUser.id, {
          otherUser: {
            id: otherUser.id,
            fullName: otherUser.fullName,
            avatarUrl: otherUser.avatarUrl,
          },
          lastMessage: {
            id: msg.id,
            content: msg.content,
            createdAt: msg.createdAt,
            fromId: msg.fromId,
          },
          unreadCount: 0,
        });
      }

      if (
        msg.toId === profile.id &&
        !msg.read &&
        msg.fromId === otherUser.id
      ) {
        const conv = conversationMap.get(otherUser.id)!;
        conv.unreadCount++;
      }
    }

    const conversations = Array.from(conversationMap.values());

    return NextResponse.json({ data: conversations }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/messages]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { toId, listingId, content } = createMessageSchema.parse(body);

    const message = await prisma.message.create({
      data: {
        fromId: profile.id,
        toId,
        listingId: listingId ?? null,
        content,
      },
    });

    return NextResponse.json({ data: message }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }
    console.error('[POST /api/messages]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
