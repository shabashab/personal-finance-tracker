import { z } from 'zod'

export const passwordRegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).openapi({
    example: 'password',
  }),
})
