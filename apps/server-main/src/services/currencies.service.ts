import { ConflictException } from '@api/exceptions/conflict.exception'
import { CurrenciesRepository } from '@database/repositories/currencies.repository'
import { UserId } from '@database/schema'
import { defineProvider } from '@mikrokit/di'

export const CurrenciesService = defineProvider(async (injector) => {
  const currenciesRepository = await injector.inject(CurrenciesRepository)

  const createUserCurrency = async (
    userId: UserId,
    name: string,
    usdExchangeRate: number
  ) => {
    const existingCurrency =
      await currenciesRepository.findCurrencyByNameAndUserId(name, userId)

    if (existingCurrency) {
      throw new ConflictException('Currency with the same name already exists')
    }

    const currency = await currenciesRepository.createCurrency(
      name,
      `${usdExchangeRate}`,
      userId
    )

    return currency
  }

  return {
    findAllCurrenciesAvailableToUserId:
      currenciesRepository.findAllCurrenciesAvailableToUserId,
    createUserCurrency,
    findCurrencyById: currenciesRepository.findCurrencyById,
  }
}, 'CurrenciesService')
