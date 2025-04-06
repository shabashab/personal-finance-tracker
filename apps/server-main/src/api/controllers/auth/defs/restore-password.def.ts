import { z } from 'zod'

export const restorePasswordRequestSchema = z.object({
  token: z.string().uuid(),

  newPassword: z.string().openapi({
    example: 'password',
    description: 'New password',
  }),
})
