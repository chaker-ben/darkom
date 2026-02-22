import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

import { createReviewSchema } from '@/features/pros/types/schemas';
import { prisma } from '@/lib/prisma';

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
    const { proId, rating, comment } = createReviewSchema.parse(body);

    const review = await prisma.review.create({
      data: {
        authorId: profile.id,
        proId,
        rating,
        comment: comment ?? null,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update pro aggregate rating
    const aggregate = await prisma.review.aggregate({
      where: { proId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.pro.update({
      where: { id: proId },
      data: {
        rating: aggregate._avg.rating ?? 0,
        reviewsCount: aggregate._count.rating,
      },
    });

    return NextResponse.json({ data: review }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }
    console.error('[POST /api/reviews]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
