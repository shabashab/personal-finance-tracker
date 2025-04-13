import { BalanceService } from '@services/balance.service'
import { defineController } from '../_utils'
import {
  getBalanceRequestQuerySchema,
  getBalanceResponseDto,
} from './defs/get-balance.def'
import { asUuid } from '@utils'
import { CurrencyId } from '@database/schema'

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
  }
)
