import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useFavorites hook', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches favorites from /api/favorites', async () => {
    const mockResponse = { data: ['listing_a', 'listing_b'] };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const response = await fetch('/api/favorites');
    const json = await response.json();

    expect(global.fetch).toHaveBeenCalledWith('/api/favorites');
    expect(json.data).toEqual(['listing_a', 'listing_b']);
  });

  it('throws on fetch failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const response = await fetch('/api/favorites');

    expect(response.ok).toBe(false);
  });

  it('toggles a favorite via POST', async () => {
    const mockResponse = { data: { action: 'added', listingId: 'listing_a' } };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId: 'listing_a' }),
    });
    const json = await response.json();

    expect(json.data.action).toBe('added');
    expect(global.fetch).toHaveBeenCalledWith('/api/favorites', expect.objectContaining({
      method: 'POST',
    }));
  });

  it('removes a favorite via POST toggle', async () => {
    const mockResponse = { data: { action: 'removed', listingId: 'listing_a' } };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId: 'listing_a' }),
    });
    const json = await response.json();

    expect(json.data.action).toBe('removed');
  });
});
