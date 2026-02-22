import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

import { createProSchema, proFiltersSchema } from '@/features/pros/types/schemas';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const { category, governorate, search, page, limit } = proFiltersSchema.parse(searchParams);

    const where: Record<string, unknown> = {};

    if (category) {
      where.category = category;
    }

    if (governorate) {
      where.governorates = { has: governorate };
    }

    if (search) {
      where.OR = [
        { businessNameFr: { contains: search, mode: 'insensitive' } },
        { businessNameAr: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [pros, total] = await Promise.all([
      prisma.pro.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: [
          { verified: 'desc' },
          { rating: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.pro.count({ where }),
    ]);

    return NextResponse.json({
      data: pros.map((pro) => ({
        ...pro,
        rating: Number(pro.rating),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[GET /api/pros]', error);
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

    const existingPro = await prisma.pro.findUnique({
      where: { userId: profile.id },
    });

    if (existingPro) {
      return NextResponse.json({ error: 'Already registered as pro' }, { status: 409 });
    }

    const body: unknown = await request.json();
    const data = createProSchema.parse(body);

    const [pro] = await prisma.$transaction([
      prisma.pro.create({
        data: {
          userId: profile.id,
          businessNameFr: data.businessNameFr,
          businessNameAr: data.businessNameAr ?? null,
          category: data.category,
          phone: data.phone,
          bioFr: data.bioFr ?? null,
          bioAr: data.bioAr ?? null,
          governorates: data.governorates,
        },
      }),
      prisma.profile.update({
        where: { id: profile.id },
        data: { role: 'PRO' },
      }),
    ]);

    return NextResponse.json({ data: pro }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }
    console.error('[POST /api/pros]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
