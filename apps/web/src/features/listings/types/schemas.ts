import { z } from 'zod';

export const createListingSchema = z.object({
  type: z.enum(['SALE', 'RENT']),
  category: z.enum(['APARTMENT', 'HOUSE', 'LAND', 'COMMERCIAL', 'OFFICE']),
  titleFr: z.string().min(5).max(120),
  titleAr: z.string().max(120).optional(),
  titleEn: z.string().max(120).optional(),
  descriptionFr: z.string().max(2000).optional(),
  descriptionAr: z.string().max(2000).optional(),
  descriptionEn: z.string().max(2000).optional(),
  price: z.number().positive(),
  surface: z.number().positive().optional(),
  rooms: z.number().int().min(0).max(20).optional(),
  bathrooms: z.number().int().min(0).max(10).optional(),
  governorate: z.string().min(1),
  city: z.string().min(1),
  address: z.string().max(200).optional(),
  images: z.array(z.string().url()).min(1).max(20),
});

export type CreateListingInput = z.infer<typeof createListingSchema>;

export const updateListingSchema = createListingSchema.partial();

export type UpdateListingInput = z.infer<typeof updateListingSchema>;

export const listingFiltersSchema = z.object({
  type: z.enum(['SALE', 'RENT']).optional(),
  category: z.enum(['APARTMENT', 'HOUSE', 'LAND', 'COMMERCIAL', 'OFFICE']).optional(),
  governorate: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  rooms: z.coerce.number().int().min(0).optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
});

export type ListingFiltersInput = z.infer<typeof listingFiltersSchema>;
