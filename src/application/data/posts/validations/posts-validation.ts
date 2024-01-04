import { z } from 'zod';

export const CreatePostSchema = z
  .object({
    title: z.string(),
    content: z.string().optional(),
    authorId: z.string(),
  })
  .required();

const recurringInterval = ['day', 'month', 'week', 'year'] as const;

export const CreatePaymentLinkSchema = z
  .object({
    postId: z.string().uuid(),
    currency: z.string().length(3).optional(),
    amount: z.number(),
    recurringInterval: z.enum(recurringInterval).default('year'),
  })
  .required();

export type CreatePostValidation = z.infer<typeof CreatePostSchema>;
export type CreatePaymentLinkValidation = z.infer<
  typeof CreatePaymentLinkSchema
>;
