import { z } from 'zod'
import { defineDto } from './_utils'
import { AccountSelect, CurrencySelect } from '@database/schema'
import { currencyDto } from './currency.dto'

export const accountDto = defineDto(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    integrationKind: z.enum(['monobank']).optional(),

    currencyId: z.string().uuid(),

    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
  (account: AccountSelect) => {
    return {
      id: account.id,
      name: account.name,
      integrationKind: account.integration?.type,

      currencyId: account.currencyId,

      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
    }
  }
)

export const accountWithCurrencyDto = defineDto(
  accountDto.schema.extend({
    currency: currencyDto.schema,
  }),
  (account: AccountSelect, currency: CurrencySelect) => {
    return {
      ...accountDto(account),
      currency: currencyDto(currency),
    }
  }
)
