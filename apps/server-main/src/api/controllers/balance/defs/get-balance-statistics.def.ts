import { defineDto } from '@dtos/_utils'
import { z } from 'zod'

export const getBalanceStatisticsRequestQuerySchema = z.object({
  currencyId: z.string().uuid(),
})

export const getBalanceStatisticsResponseDto = defineDto(
  z.record(z.string(), z.number()),
  (data: [Date, string][]) => {
    const result: Record<string, number> = {}

    for (const [date, balance] of data) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const isoStringDatePart = date.toISOString().split('T')[0]!

      result[isoStringDatePart] = Number.parseFloat(balance)
    }

    return result
  }
)
