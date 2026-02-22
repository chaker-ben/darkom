import { describe, it, expect } from 'vitest';

import { createListingSchema, listingFiltersSchema } from '../schemas';

describe('createListingSchema', () => {
  const validListing = {
    type: 'SALE' as const,
    category: 'APARTMENT' as const,
    titleFr: 'Bel appartement à Tunis',
    price: 250000,
    governorate: 'tunis',
    city: 'Tunis',
    images: ['https://res.cloudinary.com/darkom/image/upload/v1/listing1.jpg'],
  };

  it('should accept a valid listing', () => {
    const result = createListingSchema.safeParse(validListing);
    expect(result.success).toBe(true);
  });

  it('should accept a listing with all optional fields', () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      titleAr: 'شقة جميلة في تونس',
      titleEn: 'Beautiful apartment in Tunis',
      descriptionFr: 'Un très bel appartement',
      surface: 120,
      rooms: 3,
      bathrooms: 2,
      address: '10 Avenue Habib Bourguiba',
    });
    expect(result.success).toBe(true);
  });

  it('should reject a title shorter than 5 characters', () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      titleFr: 'Ab',
    });
    expect(result.success).toBe(false);
  });

  it('should reject a negative price', () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      price: -100,
    });
    expect(result.success).toBe(false);
  });

  it('should reject zero price', () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      price: 0,
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty images array', () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      images: [],
    });
    expect(result.success).toBe(false);
  });

  it('should reject more than 20 images', () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      images: Array.from({ length: 21 }, (_, i) => `https://example.com/img${i}.jpg`),
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid image URLs', () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      images: ['not-a-url'],
    });
    expect(result.success).toBe(false);
  });

  it('should reject rooms > 20', () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      rooms: 21,
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing required fields', () => {
    const result = createListingSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should reject invalid listing type', () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      type: 'INVALID',
    });
    expect(result.success).toBe(false);
  });

  it('should reject invalid category', () => {
    const result = createListingSchema.safeParse({
      ...validListing,
      category: 'INVALID',
    });
    expect(result.success).toBe(false);
  });
});

describe('listingFiltersSchema', () => {
  it('should accept empty filters with defaults', () => {
    const result = listingFiltersSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(12);
    }
  });

  it('should accept valid filters', () => {
    const result = listingFiltersSchema.safeParse({
      type: 'SALE',
      category: 'APARTMENT',
      governorate: 'tunis',
      minPrice: '50000',
      maxPrice: '300000',
      page: '2',
      limit: '24',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.minPrice).toBe(50000);
      expect(result.data.maxPrice).toBe(300000);
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(24);
    }
  });

  it('should coerce string numbers to numbers', () => {
    const result = listingFiltersSchema.safeParse({
      page: '3',
      limit: '6',
      rooms: '2',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(6);
      expect(result.data.rooms).toBe(2);
    }
  });

  it('should reject limit > 50', () => {
    const result = listingFiltersSchema.safeParse({ limit: '100' });
    expect(result.success).toBe(false);
  });
});
