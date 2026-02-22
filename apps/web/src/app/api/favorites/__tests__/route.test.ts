/* eslint-disable import/order -- vi.hoisted() + vi.mock() must precede module imports */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockProfileFindUnique, mockFavFindMany, mockFavFindUnique, mockFavCreate, mockFavDelete } = vi.hoisted(() => ({
  mockProfileFindUnique: vi.fn(),
  mockFavFindMany: vi.fn(),
  mockFavFindUnique: vi.fn(),
  mockFavCreate: vi.fn(),
  mockFavDelete: vi.fn(),
}));

vi.mock('@darkom/db', () => ({
  PrismaClient: class {
    profile = { findUnique: mockProfileFindUnique };
    favorite = {
      findMany: mockFavFindMany,
      findUnique: mockFavFindUnique,
      create: mockFavCreate,
      delete: mockFavDelete,
    };
  },
}));

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

import { GET, POST } from '../route';

const mockAuth = vi.mocked(auth);

function makeRequest(body?: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/favorites', {
    method: body ? 'POST' : 'GET',
    ...(body && {
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }),
  });
}

describe('GET /api/favorites', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);

    const response = await GET();

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 404 when profile not found', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(404);
  });

  it('returns list of favorite listing IDs', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });
    mockFavFindMany.mockResolvedValue([
      { listingId: 'listing_a' },
      { listingId: 'listing_b' },
    ]);

    const response = await GET();

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data).toEqual(['listing_a', 'listing_b']);
  });

  it('returns empty array when no favorites', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });
    mockFavFindMany.mockResolvedValue([]);

    const response = await GET();

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data).toEqual([]);
  });
});

describe('POST /api/favorites (toggle)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);

    const response = await POST(makeRequest({ listingId: 'listing_a' }));

    expect(response.status).toBe(401);
  });

  it('returns 400 for invalid body', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });

    const response = await POST(makeRequest({ listingId: '' }));

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBe('Validation error');
  });

  it('adds a favorite when not already favorited', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });
    mockFavFindUnique.mockResolvedValue(null);
    mockFavCreate.mockResolvedValue({ userId: 'profile_1', listingId: 'listing_a' });

    const response = await POST(makeRequest({ listingId: 'listing_a' }));

    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json.data.action).toBe('added');
    expect(mockFavCreate).toHaveBeenCalledWith({
      data: { userId: 'profile_1', listingId: 'listing_a' },
    });
  });

  it('removes a favorite when already favorited', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });
    mockFavFindUnique.mockResolvedValue({ userId: 'profile_1', listingId: 'listing_a' });
    mockFavDelete.mockResolvedValue({});

    const response = await POST(makeRequest({ listingId: 'listing_a' }));

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data.action).toBe('removed');
    expect(mockFavDelete).toHaveBeenCalled();
  });
});
