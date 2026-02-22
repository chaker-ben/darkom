import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockFindUnique, mockUpdate } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
  mockUpdate: vi.fn(),
}));

vi.mock('@darkom/db', () => ({
  PrismaClient: class {
    profile = {
      findUnique: mockFindUnique,
      update: mockUpdate,
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

const mockProfileData = {
  id: 'profile_1',
  fullName: 'Ali Ben Salah',
  email: 'ali@example.com',
  phone: '+21612345678',
  avatarUrl: null,
  preferredLang: 'FR',
  createdAt: new Date('2024-01-15'),
};

function makePatchRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/profile', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('GET /api/profile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);

    const response = await GET();

    expect(response.status).toBe(401);
  });

  it('returns 404 when profile not found', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockFindUnique.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(404);
  });

  it('returns profile data', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockFindUnique.mockResolvedValue(mockProfileData);

    const response = await GET();

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data.fullName).toBe('Ali Ben Salah');
    expect(json.data.email).toBe('ali@example.com');
    expect(json.data.preferredLang).toBe('FR');
  });
});

describe('PATCH /api/profile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);

    const response = await PATCH(
      makePatchRequest({ fullName: 'Ali', preferredLang: 'FR' }),
    );

    expect(response.status).toBe(401);
  });

  it('returns 400 for invalid data (name too short)', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);

    const response = await PATCH(
      makePatchRequest({ fullName: 'A', preferredLang: 'FR' }),
    );

    expect(response.status).toBe(400);
  });

  it('updates profile successfully', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    const updatedProfile = {
      ...mockProfileData,
      fullName: 'Ali Updated',
      phone: '+21698765432',
    };
    mockUpdate.mockResolvedValue(updatedProfile);

    const response = await PATCH(
      makePatchRequest({
        fullName: 'Ali Updated',
        phone: '+21698765432',
        preferredLang: 'FR',
      }),
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data.fullName).toBe('Ali Updated');
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { clerkId: 'user_123' },
        data: expect.objectContaining({
          fullName: 'Ali Updated',
          phone: '+21698765432',
          preferredLang: 'FR',
        }),
      }),
    );
  });

  it('clears optional fields when empty strings are provided', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_123' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockUpdate.mockResolvedValue({ ...mockProfileData, phone: null, avatarUrl: null });

    const response = await PATCH(
      makePatchRequest({
        fullName: 'Ali Ben Salah',
        phone: '',
        preferredLang: 'AR',
        avatarUrl: '',
      }),
    );

    expect(response.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          phone: null,
          avatarUrl: null,
          preferredLang: 'AR',
        }),
      }),
    );
  });
});
