/* eslint-disable import/order -- vi.hoisted() + vi.mock() must precede module imports */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockProfileFindUnique, mockMessageFindMany, mockMessageUpdateMany } =
  vi.hoisted(() => ({
    mockProfileFindUnique: vi.fn(),
    mockMessageFindMany: vi.fn(),
    mockMessageUpdateMany: vi.fn(),
  }));

vi.mock('@darkom/db', () => ({
  PrismaClient: class {
    profile = { findUnique: mockProfileFindUnique };
    message = {
      findMany: mockMessageFindMany,
      updateMany: mockMessageUpdateMany,
    };
  },
}));

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

import { GET, PATCH } from '../route';

const mockAuth = vi.mocked(auth);

function makeContext(conversationUserId: string) {
  return { params: Promise.resolve({ conversationUserId }) };
}

function makeRequest(
  method: string,
  conversationUserId: string,
): NextRequest {
  return new NextRequest(
    `http://localhost:3000/api/messages/${conversationUserId}`,
    { method },
  );
}

describe('GET /api/messages/[conversationUserId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({
      userId: null,
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);

    const response = await GET(
      makeRequest('GET', 'user_other'),
      makeContext('user_other'),
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

    const response = await GET(
      makeRequest('GET', 'profile_2'),
      makeContext('profile_2'),
    );

    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.error).toBe('Profile not found');
  });

  it('returns messages between two users', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_123',
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });

    const mockMessages = [
      {
        id: 'msg_1',
        fromId: 'profile_1',
        toId: 'profile_2',
        listingId: null,
        content: 'Hello',
        read: true,
        createdAt: new Date('2025-01-01T10:00:00Z'),
      },
      {
        id: 'msg_2',
        fromId: 'profile_2',
        toId: 'profile_1',
        listingId: null,
        content: 'Hi there',
        read: false,
        createdAt: new Date('2025-01-01T10:05:00Z'),
      },
    ];
    mockMessageFindMany.mockResolvedValue(mockMessages);

    const response = await GET(
      makeRequest('GET', 'profile_2'),
      makeContext('profile_2'),
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data).toHaveLength(2);
    expect(json.data[0].content).toBe('Hello');
    expect(json.data[1].content).toBe('Hi there');

    expect(mockMessageFindMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { fromId: 'profile_1', toId: 'profile_2' },
          { fromId: 'profile_2', toId: 'profile_1' },
        ],
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        fromId: true,
        toId: true,
        listingId: true,
        content: true,
        read: true,
        createdAt: true,
      },
    });
  });

  it('handles server errors gracefully', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_123',
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });
    mockMessageFindMany.mockRejectedValue(new Error('DB error'));

    const response = await GET(
      makeRequest('GET', 'profile_2'),
      makeContext('profile_2'),
    );

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json.error).toBe('Internal server error');
  });
});

describe('PATCH /api/messages/[conversationUserId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({
      userId: null,
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);

    const response = await PATCH(
      makeRequest('PATCH', 'user_other'),
      makeContext('user_other'),
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

    const response = await PATCH(
      makeRequest('PATCH', 'profile_2'),
      makeContext('profile_2'),
    );

    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.error).toBe('Profile not found');
  });

  it('marks messages as read', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_123',
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });
    mockMessageUpdateMany.mockResolvedValue({ count: 3 });

    const response = await PATCH(
      makeRequest('PATCH', 'profile_2'),
      makeContext('profile_2'),
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data.markedRead).toBe(3);

    expect(mockMessageUpdateMany).toHaveBeenCalledWith({
      where: {
        fromId: 'profile_2',
        toId: 'profile_1',
        read: false,
      },
      data: { read: true },
    });
  });

  it('handles server errors gracefully', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_123',
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });
    mockMessageUpdateMany.mockRejectedValue(new Error('DB error'));

    const response = await PATCH(
      makeRequest('PATCH', 'profile_2'),
      makeContext('profile_2'),
    );

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json.error).toBe('Internal server error');
  });
});
