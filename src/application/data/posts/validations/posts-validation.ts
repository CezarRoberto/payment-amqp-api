import { z } from 'zod';

export const CreatePostSchema = z
  .object({
    title: z.string(),
    content: z.string().optional(),
    authorId: z.string(),
  })
  .required();

export type CreatePostValidation = z.infer<typeof CreatePostSchema>;
