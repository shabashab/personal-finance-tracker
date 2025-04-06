import { z } from 'zod'
import { registerUserOptionsSchema } from './commons/register-user-options'

export const developmentRegisterRequestSchema = z.object({
  email: z.string().email(),
  options: registerUserOptionsSchema,
})
