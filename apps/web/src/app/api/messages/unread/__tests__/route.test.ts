/* eslint-disable import/order -- vi.hoisted() + vi.mock() must precede module imports */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockProfileFindUnique, mockMessageCount } = vi.hoisted(() => ({
  mockProfileFindUnique: vi.fn(),
  mockMessageCount: vi.fn(),
}));

vi.mock('@darkom/db', () => ({
  PrismaClient: class {
    profile = { findUnique: mockProfileFindUnique };
    message = { count: mockMessageCount };
  },
}));

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

import { auth } from '@clerk/nextjs/server';

import { GET } from '../route';

const mockAuth = vi.mocked(auth);

describe('GET /api/messages/unread', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({
      userId: null,
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);

    const response = await GET();

    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 404 when profile not found', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_123',
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.error).toBe('Profile not found');
  });

  it('returns unread count', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_123',
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });
    mockMessageCount.mockResolvedValue(5);

    const response = await GET();

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data.count).toBe(5);
    expect(mockMessageCount).toHaveBeenCalledWith({
      where: {
        toId: 'profile_1',
        read: false,
      },
    });
  });

  it('returns zero when no unread messages', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_123',
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });
    mockMessageCount.mockResolvedValue(0);

    const response = await GET();

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data.count).toBe(0);
  });

  it('handles server errors gracefully', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user_123',
    } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockProfileFindUnique.mockResolvedValue({ id: 'profile_1' });
    mockMessageCount.mockRejectedValue(new Error('DB error'));

    const response = await GET();

    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json.error).toBe('Internal server error');
  });
});
