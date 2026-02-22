/* eslint-disable import/order -- vi.hoisted() + vi.mock() must precede module imports */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockFindUnique } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
}));

vi.mock('@darkom/db', () => ({
  PrismaClient: class {
    profile = {
      findUnique: mockFindUnique,
    };
  },
}));

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

import { auth } from '@clerk/nextjs/server';

import { getCurrentProfile, requireProfile } from '../auth';

const mockAuth = vi.mocked(auth);

const mockProfile = {
  id: 'profile_1',
  clerkId: 'user_abc123',
  email: 'ali@example.com',
  role: 'USER',
  fullName: 'Ali Ben Salah',
  phone: null,
  avatarUrl: null,
  preferredLang: 'FR',
  verified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('getCurrentProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when user is not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);

    const result = await getCurrentProfile();

    expect(result).toBeNull();
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it('returns the profile when user is authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc123' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockFindUnique.mockResolvedValue(mockProfile);

    const result = await getCurrentProfile();

    expect(result).toEqual(mockProfile);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { clerkId: 'user_abc123' },
    });
  });

  it('returns null when authenticated but profile not found', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_unknown' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockFindUnique.mockResolvedValue(null);

    const result = await getCurrentProfile();

    expect(result).toBeNull();
  });
});

describe('requireProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the profile when user is authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_abc123' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockFindUnique.mockResolvedValue(mockProfile);

    const result = await requireProfile();

    expect(result).toEqual(mockProfile);
  });

  it('throws when user is not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);

    await expect(requireProfile()).rejects.toThrow(
      'Unauthorized: no profile found',
    );
  });

  it('throws when profile not found in DB', async () => {
    mockAuth.mockResolvedValue({ userId: 'user_orphan' } as ReturnType<typeof auth> extends Promise<infer R> ? R : never);
    mockFindUnique.mockResolvedValue(null);

    await expect(requireProfile()).rejects.toThrow(
      'Unauthorized: no profile found',
    );
  });
});
