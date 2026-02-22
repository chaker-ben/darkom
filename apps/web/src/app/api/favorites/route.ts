import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';


const toggleFavoriteSchema = z.object({
  listingId: z.string().min(1),
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
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: profile.id },
      select: { listingId: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      data: favorites.map((f) => f.listingId),
    });
  } catch (error) {
    console.error('[GET /api/favorites]', error);
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
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const { listingId } = toggleFavoriteSchema.parse(body);

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: profile.id,
          listingId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: {
          userId_listingId: {
            userId: profile.id,
            listingId,
          },
        },
      });
      return NextResponse.json({ data: { action: 'removed', listingId } });
    }

    await prisma.favorite.create({
      data: {
        userId: profile.id,
        listingId,
      },
    });

    return NextResponse.json(
      { data: { action: 'added', listingId } },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }
    console.error('[POST /api/favorites]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
