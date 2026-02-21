import { describe, it, expect } from 'vitest';

import { formatPrice, formatCompactPrice, formatDate, formatSurface } from '../format';

describe('formatPrice', () => {
  it('should format price in French locale', () => {
    const result = formatPrice(185000, 'fr');
    expect(result).toContain('185');
  });

  it('should format price in Arabic locale', () => {
    const result = formatPrice(185000, 'ar');
    expect(result).toBeTruthy();
  });

  it('should format price in English locale', () => {
    const result = formatPrice(185000, 'en');
    expect(result).toContain('185');
  });

  it('should format zero correctly', () => {
    const result = formatPrice(0, 'fr');
    expect(result).toContain('0');
  });
});

describe('formatCompactPrice', () => {
  it('should format large numbers compactly', () => {
    const result = formatCompactPrice(185000, 'fr');
    expect(result).toBeTruthy();
  });

  it('should handle small numbers', () => {
    const result = formatCompactPrice(500, 'fr');
    expect(result).toBeTruthy();
  });
});

describe('formatDate', () => {
  it('should format a date string', () => {
    const result = formatDate('2026-02-21', 'fr');
    expect(result).toContain('2026');
  });

  it('should format a Date object', () => {
    const result = formatDate(new Date(2026, 1, 21), 'fr');
    expect(result).toContain('2026');
  });

  it('should work with Arabic locale', () => {
    const result = formatDate('2026-02-21', 'ar');
    expect(result).toBeTruthy();
  });
});

describe('formatSurface', () => {
  it('should format surface with m²', () => {
    const result = formatSurface(95, 'fr');
    expect(result).toContain('95');
    expect(result).toContain('m²');
  });

  it('should format large surface values', () => {
    const result = formatSurface(1500, 'fr');
    expect(result).toContain('m²');
  });
});
