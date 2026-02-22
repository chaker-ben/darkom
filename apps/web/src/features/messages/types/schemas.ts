import { z } from 'zod';

export const sendMessageSchema = z.object({
  toId: z.string().min(1),
  listingId: z.string().optional(),
  content: z.string().min(1).max(2000),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

export const markReadSchema = z.object({
  conversationUserId: z.string().min(1),
});

export type MarkReadInput = z.infer<typeof markReadSchema>;
