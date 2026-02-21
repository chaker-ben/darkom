import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { validateEnv } from '../env';

describe('validateEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should validate correct environment variables', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/darkom';
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_xxx';
    process.env.CLERK_SECRET_KEY = 'sk_test_xxx';

    expect(() => validateEnv()).not.toThrow();
  });

  it('should throw on missing DATABASE_URL', () => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_xxx';
    process.env.CLERK_SECRET_KEY = 'sk_test_xxx';
    delete process.env.DATABASE_URL;

    expect(() => validateEnv()).toThrow('Invalid environment variables');
  });

  it('should throw on missing Clerk keys', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/darkom';
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    delete process.env.CLERK_SECRET_KEY;

    expect(() => validateEnv()).toThrow('Invalid environment variables');
  });

  it('should accept optional fields', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/darkom';
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_xxx';
    process.env.CLERK_SECRET_KEY = 'sk_test_xxx';
    process.env.NEXT_PUBLIC_APP_URL = 'https://darkom.com';
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN = 'pk.xxx';

    const env = validateEnv();
    expect(env.NEXT_PUBLIC_APP_URL).toBe('https://darkom.com');
  });
});
