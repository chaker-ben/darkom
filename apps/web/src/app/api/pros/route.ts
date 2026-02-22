import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { proFiltersSchema } from '@/features/pros/types/schemas';
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
