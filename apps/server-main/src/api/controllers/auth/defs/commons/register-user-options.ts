import { z } from 'zod'

export const registerUserOptionsSchema = z.object({
  verifyEmail: z.boolean().optional().openapi({
    example: true,
  }),
  isAdmin: z.boolean().optional().openapi({
    example: true,
  }),
})
