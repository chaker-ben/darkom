/* eslint-disable import/order -- vi.hoisted() + vi.mock() must precede module imports */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockProFindMany, mockProCount } = vi.hoisted(() => ({
  mockProFindMany: vi.fn(),
  mockProCount: vi.fn(),
}));

vi.mock('@darkom/db', () => ({
  PrismaClient: class {
    pro = {
      findMany: mockProFindMany,
      count: mockProCount,
    };
  },
}));

import { NextRequest } from 'next/server';

import { GET } from '../route';

function makeRequest(params?: Record<string, string>) {
  const url = new URL('http://localhost:3000/api/pros');
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  }
  return new NextRequest(url);
}

describe('GET /api/pros', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns paginated list of pros', async () => {
    const mockPros = [
      {
        id: '1',
        businessNameFr: 'Pro 1',
        businessNameAr: null,
        category: 'plumber',
        phone: '+216123',
        whatsapp: null,
        governorates: ['Tunis'],
        plan: 'FREE',
        rating: { toNumber: () => 4.5 },
        reviewsCount: 10,
        verified: true,
        logoUrl: null,
        user: { id: 'u1', fullName: 'User 1', avatarUrl: null },
      },
    ];
    mockProFindMany.mockResolvedValue(mockPros);
    mockProCount.mockResolvedValue(1);

    const response = await GET(makeRequest());

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data).toHaveLength(1);
    expect(json.pagination).toBeDefined();
    expect(json.pagination.total).toBe(1);
  });

  it('filters by category', async () => {
    mockProFindMany.mockResolvedValue([]);
    mockProCount.mockResolvedValue(0);

    await GET(makeRequest({ category: 'plumber' }));

    expect(mockProFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ category: 'plumber' }),
      }),
    );
  });

  it('filters by governorate', async () => {
    mockProFindMany.mockResolvedValue([]);
    mockProCount.mockResolvedValue(0);

    await GET(makeRequest({ governorate: 'Tunis' }));

    expect(mockProFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ governorates: { has: 'Tunis' } }),
      }),
    );
  });

  it('filters by search term', async () => {
    mockProFindMany.mockResolvedValue([]);
    mockProCount.mockResolvedValue(0);

    await GET(makeRequest({ search: 'Ahmed' }));

    expect(mockProFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { businessNameFr: { contains: 'Ahmed', mode: 'insensitive' } },
            { businessNameAr: { contains: 'Ahmed', mode: 'insensitive' } },
          ],
        }),
      }),
    );
  });

  it('returns empty list when no pros match', async () => {
    mockProFindMany.mockResolvedValue([]);
    mockProCount.mockResolvedValue(0);

    const response = await GET(makeRequest({ category: 'nonexistent' }));

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data).toEqual([]);
    expect(json.pagination.total).toBe(0);
  });

  it('handles pagination parameters', async () => {
    mockProFindMany.mockResolvedValue([]);
    mockProCount.mockResolvedValue(25);

    await GET(makeRequest({ page: '2', limit: '10' }));

    expect(mockProFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 10,
        take: 10,
      }),
    );
  });

  it('uses default pagination when no params provided', async () => {
    mockProFindMany.mockResolvedValue([]);
    mockProCount.mockResolvedValue(0);

    await GET(makeRequest());

    expect(mockProFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 12,
      }),
    );
  });

  it('returns correct totalPages calculation', async () => {
    mockProFindMany.mockResolvedValue([]);
    mockProCount.mockResolvedValue(25);

    const response = await GET(makeRequest({ limit: '10' }));

    const json = await response.json();
    expect(json.pagination.totalPages).toBe(3);
  });

  it('orders by verified desc then rating desc', async () => {
    mockProFindMany.mockResolvedValue([]);
    mockProCount.mockResolvedValue(0);

    await GET(makeRequest());

    expect(mockProFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [
          { verified: 'desc' },
          { rating: 'desc' },
        ],
      }),
    );
  });
});
