import { z } from 'zod';

export const proFiltersSchema = z.object({
  category: z.string().optional(),
  governorate: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type ProFiltersInput = z.infer<typeof proFiltersSchema>;

export const createReviewSchema = z.object({
  proId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const createProSchema = z.object({
  businessNameFr: z.string().min(2).max(100),
  businessNameAr: z.string().max(100).optional(),
  category: z.string().min(1),
  phone: z.string().min(8).max(15),
  bioFr: z.string().max(1000).optional(),
  bioAr: z.string().max(1000).optional(),
  governorates: z.array(z.string()).min(1, 'At least one service area required'),
});

export type CreateProInput = z.infer<typeof createProSchema>;
