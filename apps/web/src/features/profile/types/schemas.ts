import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z
    .string()
    .regex(/^\+?[0-9]{8,15}$/)
    .optional()
    .or(z.literal('')),
  preferredLang: z.enum(['FR', 'AR', 'EN']),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
