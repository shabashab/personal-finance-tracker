import { currencyDto } from '@dtos/currency.dto'
import { z } from 'zod'

export const createCurrencyRequestSchema = z.object({
  name: z.string(),
  usdExchangeRate: z.number(),
})

export const createCurrencyResponseDto = currencyDto
