import { describe, expect, it } from 'vitest';

import { updateProfileSchema } from '../schemas';

describe('updateProfileSchema', () => {
  const validProfile = {
    fullName: 'Ali Ben Salah',
    preferredLang: 'FR' as const,
  };

  it('accepts valid profile with minimum fields', () => {
    const result = updateProfileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it('accepts valid profile with all fields', () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      phone: '+21612345678',
      avatarUrl: 'https://res.cloudinary.com/darkom/image/upload/avatar.jpg',
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty string for optional phone', () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      phone: '',
    });
    expect(result.success).toBe(true);
  });

  it('accepts empty string for optional avatarUrl', () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      avatarUrl: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects fullName shorter than 2 characters', () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      fullName: 'A',
    });
    expect(result.success).toBe(false);
  });

  it('rejects fullName longer than 100 characters', () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      fullName: 'A'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid phone format', () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      phone: 'not-a-phone',
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid Tunisian phone number', () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      phone: '+21698765432',
    });
    expect(result.success).toBe(true);
  });

  it('accepts phone without plus prefix', () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      phone: '21698765432',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid preferredLang', () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      preferredLang: 'DE',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid preferredLang values', () => {
    for (const lang of ['FR', 'AR', 'EN']) {
      const result = updateProfileSchema.safeParse({
        ...validProfile,
        preferredLang: lang,
      });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid avatarUrl (not a URL)', () => {
    const result = updateProfileSchema.safeParse({
      ...validProfile,
      avatarUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const result = updateProfileSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
