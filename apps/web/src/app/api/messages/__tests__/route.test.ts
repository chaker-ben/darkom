/* eslint-disable import/order -- vi.hoisted() + vi.mock() must precede module imports */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockProfileFindUnique, mockMessageCreate } = vi.hoisted(() => ({
  mockProfileFindUnique: vi.fn(),
  mockMessageCreate: vi.fn(),
}));

vi.mock('@darkom/db', () => ({
  PrismaClient: class {
    profile = { findUnique: mockProfileFindUnique };
    message = { create: mockMessageCreate };
  },
}));

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

import { POST } from '../route';

const mockAuth = vi.mocked(auth);

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/messages', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/messages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({
      userId: null,
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);

    const response = await POST(
      makeRequest({ toId: 'u1', content: 'Hello' }),
    );

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 404 when profile not found', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_123',
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue(null);

    const response = await POST(
      makeRequest({ toId: 'profile_2', content: 'Hello' }),
    );

    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.error).toBe('Profile not found');
  });

  it('returns 400 for invalid body', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_123',
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });

    const response = await POST(makeRequest({ toId: '', content: '' }));

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.error).toBe('Validation error');
  });

  it('creates a message successfully', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_123',
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });
    mockMessageCreate.mockResolvedValue({
      id: 'msg_1',
      fromId: 'profile_1',
      toId: 'profile_2',
      listingId: 'listing_1',
      content: 'Hello',
      read: false,
    });

    const response = await POST(
      makeRequest({
        toId: 'profile_2',
        listingId: 'listing_1',
        content: 'Hello',
      }),
    );

    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json.data.content).toBe('Hello');
    expect(mockMessageCreate).toHaveBeenCalledWith({
      data: {
        fromId: 'profile_1',
        toId: 'profile_2',
        listingId: 'listing_1',
        content: 'Hello',
      },
    });
  });

  it('creates a message without listingId', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_123',
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });
    mockMessageCreate.mockResolvedValue({
      id: 'msg_2',
      fromId: 'profile_1',
      toId: 'profile_2',
      listingId: null,
      content: 'Hi there',
      read: false,
    });

    const response = await POST(
      makeRequest({ toId: 'profile_2', content: 'Hi there' }),
    );

    expect(response.status).toBe(201);
    expect(mockMessageCreate).toHaveBeenCalledWith({
      data: {
        fromId: 'profile_1',
        toId: 'profile_2',
        listingId: null,
        content: 'Hi there',
      },
    });
  });

  it('handles server errors gracefully', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_123',
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });
    mockMessageCreate.mockRejectedValue(new Error('DB error'));

    const response = await POST(
      makeRequest({ toId: 'profile_2', content: 'Hello' }),
    );

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json.error).toBe('Internal server error');
  });
});
