import { z } from 'zod'

export const passwordLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).openapi({
    example: 'password',
  }),
})
