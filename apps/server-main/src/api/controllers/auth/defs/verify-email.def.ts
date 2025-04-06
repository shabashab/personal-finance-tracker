import { z } from 'zod'

export const verifyEmailRequestSchema = z.object({
  token: z.string().uuid(),
})
