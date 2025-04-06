import { z } from 'zod'

export const initPasswordRestoreRequestSchema = z.object({
  email: z.string().email(),
})
