import { CurrenciesRepository } from '@database/repositories/currencies.repository'
import { defineProvider } from '@mikrokit/di'

export const CurrenciesService = defineProvider(async (injector) => {
  const currenciesRepository = await injector.inject(CurrenciesRepository)

  return {
    findAllCurrenciesAvailableToUserId:
      currenciesRepository.findAllCurrenciesAvailableToUserId,
  }
}, 'CurrenciesService')
