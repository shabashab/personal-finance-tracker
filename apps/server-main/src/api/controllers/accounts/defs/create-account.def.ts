import { accountDto } from '@dtos/account.dto'
import { z } from 'zod'

export const createAccountRequestSchema = z.object({
  name: z.string().min(1),
  currencyId: z.string().uuid(),
  integration: z
    .object({
      type: z.literal('monobank'),
      token: z.string().min(1),
      accountId: z.string().min(1),
    })
    .optional(),
})

export const createAccountResponseDto = accountDto
