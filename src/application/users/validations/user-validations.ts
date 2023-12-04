import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
}).required()

export type CreateUseralidation = z.infer<typeof CreateUserSchema>