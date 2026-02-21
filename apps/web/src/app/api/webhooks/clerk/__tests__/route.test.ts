import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockCreate, mockUpdate, mockDelete } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockUpdate: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock('@darkom/db', () => ({
  PrismaClient: class {
    profile = {
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
    };
  },
}));

vi.mock('@clerk/backend/webhooks', () => ({
  verifyWebhook: vi.fn(),
}));

import { verifyWebhook } from '@clerk/backend/webhooks';

import { POST } from '../route';

const mockVerifyWebhook = vi.mocked(verifyWebhook);

function makeRequest(body: Record<string, unknown> = {}): Request {
  return new Request('http://localhost:3000/api/webhooks/clerk', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('Clerk Webhook Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a profile on user.created', async () => {
    mockVerifyWebhook.mockResolvedValue({
      type: 'user.created',
      data: {
        id: 'user_abc123',
        first_name: 'Ali',
        last_name: 'Ben Salah',
        image_url: 'https://img.clerk.com/avatar.jpg',
        primary_email_address_id: 'email_1',
        email_addresses: [
          { id: 'email_1', email_address: 'ali@example.com' },
        ],
      },
    } as unknown as Awaited<ReturnType<typeof verifyWebhook>>);

    const response = await POST(makeRequest());
    const json = await response.json();

    expect(json).toEqual({ success: true });
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        clerkId: 'user_abc123',
        email: 'ali@example.com',
        fullName: 'Ali Ben Salah',
        avatarUrl: 'https://img.clerk.com/avatar.jpg',
      },
    });
  });

  it('updates a profile on user.updated', async () => {
    mockVerifyWebhook.mockResolvedValue({
      type: 'user.updated',
      data: {
        id: 'user_abc123',
        first_name: 'Ali',
        last_name: 'Trabelsi',
        image_url: 'https://img.clerk.com/new-avatar.jpg',
        primary_email_address_id: 'email_1',
        email_addresses: [
          { id: 'email_1', email_address: 'ali.new@example.com' },
        ],
      },
    } as unknown as Awaited<ReturnType<typeof verifyWebhook>>);

    const response = await POST(makeRequest());
    const json = await response.json();

    expect(json).toEqual({ success: true });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { clerkId: 'user_abc123' },
      data: {
        email: 'ali.new@example.com',
        fullName: 'Ali Trabelsi',
        avatarUrl: 'https://img.clerk.com/new-avatar.jpg',
      },
    });
  });

  it('deletes a profile on user.deleted', async () => {
    mockVerifyWebhook.mockResolvedValue({
      type: 'user.deleted',
      data: { id: 'user_abc123' },
    } as unknown as Awaited<ReturnType<typeof verifyWebhook>>);

    const response = await POST(makeRequest());
    const json = await response.json();

    expect(json).toEqual({ success: true });
    expect(mockDelete).toHaveBeenCalledWith({
      where: { clerkId: 'user_abc123' },
    });
  });

  it('returns 401 on invalid webhook signature', async () => {
    mockVerifyWebhook.mockRejectedValue(
      new Error('Failed to verify webhook'),
    );

    const response = await POST(makeRequest());
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json).toEqual({ error: 'Invalid webhook signature' });
  });

  it('handles user.created with no name gracefully', async () => {
    mockVerifyWebhook.mockResolvedValue({
      type: 'user.created',
      data: {
        id: 'user_noname',
        first_name: null,
        last_name: null,
        image_url: null,
        primary_email_address_id: 'email_1',
        email_addresses: [
          { id: 'email_1', email_address: 'noname@example.com' },
        ],
      },
    } as unknown as Awaited<ReturnType<typeof verifyWebhook>>);

    await POST(makeRequest());

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        clerkId: 'user_noname',
        email: 'noname@example.com',
        fullName: null,
        avatarUrl: null,
      },
    });
  });
});
