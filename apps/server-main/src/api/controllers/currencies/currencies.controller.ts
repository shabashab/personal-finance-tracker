import { CurrenciesService } from '@services/currencies.service'
import { defineController } from '../_utils'
import { getCurrenciesResponseDto } from './defs/get-currencies.def'

export const CurrenciesController = defineController(
  '/currencies',
  async (r, injector) => {
    const currenciesService = await injector.inject(CurrenciesService)

    r.auth.get(
      '/',
      {
        docs: {
          tags: ['currencies'],
          description: 'Get all available currencies',
        },
        response: getCurrenciesResponseDto.schema,
      },
      async ({ user }) => {
        const availableCurrencies =
          await currenciesService.findAllCurrenciesAvailableToUserId(user.id)

        return getCurrenciesResponseDto(availableCurrencies)
      }
    )
  }
)
