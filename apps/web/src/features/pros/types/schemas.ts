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
