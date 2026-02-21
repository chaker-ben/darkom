import { describe, it, expect } from 'vitest';

import { safeAsync } from '../safe-async';

describe('safeAsync', () => {
  it('should return data on success', async () => {
    const result = await safeAsync(async () => 42);
    expect(result.data).toBe(42);
    expect(result.error).toBeNull();
  });

  it('should return error on failure', async () => {
    const result = await safeAsync(async () => {
      throw new Error('test error');
    });
    expect(result.data).toBeNull();
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe('test error');
  });

  it('should handle non-Error throws', async () => {
    const result = await safeAsync(async () => {
      throw 'string error';
    });
    expect(result.data).toBeNull();
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe('string error');
  });

  it('should handle async operations', async () => {
    const result = await safeAsync(async () => {
      return new Promise<string>((resolve) => setTimeout(() => resolve('done'), 10));
    });
    expect(result.data).toBe('done');
    expect(result.error).toBeNull();
  });
});
