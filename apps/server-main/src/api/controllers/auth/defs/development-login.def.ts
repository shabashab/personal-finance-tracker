import { z } from 'zod'

export const developmentLoginRequestSchema = z.object({
  id: z.string().uuid(),
})
