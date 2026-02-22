import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { createListingSchema, listingFiltersSchema } from '@/features/listings/types/schemas';

import type { NextRequest } from 'next/server';

const ITEMS_PER_PAGE = 12;

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const filters = listingFiltersSchema.parse(searchParams);
    const page = filters.page ?? 1;
    const limit = filters.limit ?? ITEMS_PER_PAGE;
    const skip = (page - 1) * limit;

    const where = {
      status: 'VERIFIED' as const,
      ...(filters.type && { type: filters.type }),
      ...(filters.category && { category: filters.category }),
      ...(filters.governorate && { governorate: filters.governorate }),
      ...(filters.minPrice || filters.maxPrice
        ? {
            price: {
              ...(filters.minPrice && { gte: filters.minPrice }),
              ...(filters.maxPrice && { lte: filters.maxPrice }),
            },
          }
        : {}),
      ...(filters.rooms !== undefined && { rooms: { gte: filters.rooms } }),
    };

    const [listings, total] = await prisma.$transaction([
      prisma.listing.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        select: {
          id: true,
          type: true,
          category: true,
          titleFr: true,
          titleAr: true,
          titleEn: true,
          price: true,
          priceCurrency: true,
          surface: true,
          rooms: true,
          bathrooms: true,
          governorate: true,
          city: true,
          images: true,
          status: true,
          featured: true,
          createdAt: true,
        },
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      data: listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[GET /api/listings]', error);
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
    const data = createListingSchema.parse(body);

    const listing = await prisma.listing.create({
      data: {
        ...data,
        userId: profile.id,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ data: listing }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: (error as { errors?: unknown }).errors },
        { status: 400 },
      );
    }
    console.error('[POST /api/listings]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
