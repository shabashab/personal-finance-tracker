import { defineDto } from '@dtos/_utils'
import { z } from 'zod'

export const getBalanceRequestQuerySchema = z.object({
  currencyId: z.string().uuid(),
})

export const getBalanceResponseDto = defineDto(
  z.object({
    balance: z.number(),
  }),
  (balance: string) => {
    return {
      balance: Number.parseFloat(balance),
    }
  }
)
