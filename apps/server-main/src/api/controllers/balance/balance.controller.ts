import { BalanceService } from '@services/balance.service'
import { defineController } from '../_utils'
import {
  getBalanceRequestQuerySchema,
  getBalanceResponseDto,
} from './defs/get-balance.def'
import { asUuid } from '@utils'
import { CurrencyId } from '@database/schema'
import {
  getBalanceStatisticsRequestQuerySchema,
  getBalanceStatisticsResponseDto,
} from './defs/get-balance-statistics.def'

export const BalanceController = defineController(
  '/balance',
  async (r, injector) => {
    const balanceService = await injector.inject(BalanceService)

    r.auth.get(
      '/',
      {
        docs: {
          tags: ['balance'],
          description: 'Get user balance',
        },
        request: {
          query: getBalanceRequestQuerySchema,
        },
        response: getBalanceResponseDto.schema,
      },
      async ({ user, query }) => {
        const balance = await balanceService.findBalanceByUserIdInCurrency(
          user.id,
          asUuid<CurrencyId>(query.currencyId)
        )

        return getBalanceResponseDto(balance)
      }
    )

    r.auth.get(
      '/statistics',
      {
        docs: {
          tags: ['balance'],
          description: 'Get user balance statistics for the last 30 days',
        },
        request: {
          query: getBalanceStatisticsRequestQuerySchema,
        },
        response: getBalanceStatisticsResponseDto.schema,
      },
      async ({ user, query }) => {
        const balanceStatistics =
          await balanceService.findBalanceStatisticsForLast30Days(
            user.id,
            asUuid<CurrencyId>(query.currencyId)
          )

        return getBalanceStatisticsResponseDto(balanceStatistics)
      }
    )
  }
)
