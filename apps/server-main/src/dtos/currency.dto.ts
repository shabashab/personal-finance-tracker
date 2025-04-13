import { z } from 'zod'
import { defineDto } from './_utils'
import { CurrencySelect } from '@database/schema'

export const currencyDto = defineDto(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    usdExchangeRate: z.number(),
  }),
  (currency: CurrencySelect) => {
    return {
      id: currency.id,
      name: currency.name,
      usdExchangeRate: Number.parseFloat(currency.usdExchangeRate),
    }
  }
)
