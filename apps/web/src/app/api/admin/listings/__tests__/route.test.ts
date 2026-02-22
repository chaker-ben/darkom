/* eslint-disable import/order -- vi.hoisted() + vi.mock() must precede module imports */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockProfileFindUnique, mockListingUpdate } = vi.hoisted(() => ({
  mockProfileFindUnique: vi.fn(),
  mockListingUpdate: vi.fn(),
}));

vi.mock('@darkom/db', () => ({
  PrismaClient: class {
    profile = { findUnique: mockProfileFindUnique };
    listing = { update: mockListingUpdate };
  },
}));

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

import { PATCH } from '../[id]/route';

const mockAuth = vi.mocked(auth);

function makePatchRequest(id: string, body: Record<string, unknown>) {
  return {
    request: new NextRequest(`http://localhost:3000/api/admin/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }),
    params: Promise.resolve({ id }),
  };
}

describe('PATCH /api/admin/listings/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    const { request, params } = makePatchRequest('listing_1', { status: 'VERIFIED' });

    const response = await PATCH(request, { params });

    expect(response.status).toBe(401);
  });

  it('returns 403 when user is not admin', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1', role: 'USER' });
    const { request, params } = makePatchRequest('listing_1', { status: 'VERIFIED' });

    const response = await PATCH(request, { params });

    expect(response.status).toBe(403);
    const json = await response.json();
    expect(json.error).toBe('Forbidden');
  });

  it('returns 403 when profile not found', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue(null);
    const { request, params } = makePatchRequest('listing_1', { status: 'VERIFIED' });

    const response = await PATCH(request, { params });

    expect(response.status).toBe(403);
  });

  it('returns 400 for invalid status', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_admin' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_admin', role: 'ADMIN' });
    const { request, params } = makePatchRequest('listing_1', { status: 'INVALID' });

    const response = await PATCH(request, { params });

    expect(response.status).toBe(400);
  });

  it('approves a listing (VERIFIED)', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_admin' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_admin', role: 'ADMIN' });
    mockListingUpdate.mockResolvedValue({ id: 'listing_1', titleFr: 'Test', status: 'VERIFIED' });
    const { request, params } = makePatchRequest('listing_1', { status: 'VERIFIED' });

    const response = await PATCH(request, { params });

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data.status).toBe('VERIFIED');
    expect(mockListingUpdate).toHaveBeenCalledWith({
      where: { id: 'listing_1' },
      data: { status: 'VERIFIED' },
      select: expect.any(Object),
    });
  });

  it('rejects a listing (REJECTED)', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_admin' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_admin', role: 'ADMIN' });
    mockListingUpdate.mockResolvedValue({ id: 'listing_1', titleFr: 'Test', status: 'REJECTED' });
    const { request, params } = makePatchRequest('listing_1', { status: 'REJECTED' });

    const response = await PATCH(request, { params });

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data.status).toBe('REJECTED');
  });
});
