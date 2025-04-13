import { CurrenciesService } from '@services/currencies.service'
import { defineController } from '../_utils'
import { getCurrenciesResponseDto } from './defs/get-currencies.def'
import {
  createCurrencyRequestSchema,
  createCurrencyResponseDto,
} from './defs/create-currency.def'

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

    r.auth.post(
      '/',
      {
        docs: {
          tags: ['currencies'],
          description: 'Create custom currency',
        },
        request: {
          body: createCurrencyRequestSchema,
        },
        response: createCurrencyResponseDto.schema,
      },
      async ({ body, user }, reply) => {
        const createdCurrency = await currenciesService.createUserCurrency(
          user.id,
          body.name,
          body.usdExchangeRate
        )

        reply.code(201)
        return createCurrencyResponseDto(createdCurrency)
      }
    )
  }
)
