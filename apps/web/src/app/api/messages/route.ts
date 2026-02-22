import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

const createMessageSchema = z.object({
  toId: z.string().min(1),
  listingId: z.string().optional(),
  content: z.string().min(1).max(2000),
});

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
