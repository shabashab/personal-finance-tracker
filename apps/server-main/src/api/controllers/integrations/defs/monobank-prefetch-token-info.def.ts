import { defineDto } from '@dtos/_utils'
import { MonobankClientInfo } from '@interfaces/integrations/monobank-client-info.interface'
import { z } from 'zod'
import currencyCodes from 'currency-codes'

export const monobankPrefetchTokenInfoRequestParamsSchema = z.object({
  token: z.string(),
})

export const monobankPrefetchTokenInfoResponseDto = defineDto(
  z.object({
    name: z.string(),
    accounts: z
      .object({
        id: z.string(),
        balance: z.number(),
        type: z.string(),
        currencyCode: z.number(),
        currencyName: z.string(),
      })
      .array(),
  }),
  (monobankClientInfo: MonobankClientInfo) => ({
    name: monobankClientInfo.name,
    accounts: monobankClientInfo.accounts.map((account) => ({
      id: account.id,
      balance: account.balance / 100,
      type: account.type,
      currencyCode: account.currencyCode,
      currencyName: currencyCodes.number(`${account.currencyCode}`)!.code,
    })),
  })
)
