import { CurrencyId, UserId } from '@database/schema'
import { defineProvider } from '@mikrokit/di'
import { CurrenciesService } from './currencies.service'
import { NotFoundException } from '@api/exceptions/not-found.exception'
import { UsersService } from './users.service'
import { BalanceRepository } from '@database/repositories/balance.repository'

export const BalanceService = defineProvider(async (injector) => {
  const balanceRepository = await injector.inject(BalanceRepository)
  const currenciesService = await injector.inject(CurrenciesService)
  const usersService = await injector.inject(UsersService)

  const findBalanceByUserIdInCurrency = async (
    userId: UserId,
    currencyId: CurrencyId
  ) => {
    const currency = await currenciesService.findCurrencyById(currencyId)

    if (!currency) {
      throw new NotFoundException('Currency not found')
    }

    const user = await usersService.findUserById(userId)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return await balanceRepository.findTotalBalanceByUserId(
      userId,
      currency.usdExchangeRate
    )
  }

  const findBalanceStatisticsForLast30Days = async (
    userId: UserId,
    currencyId: CurrencyId
  ) => {
    const currency = await currenciesService.findCurrencyById(currencyId)

    if (!currency) {
      throw new NotFoundException('Currency not found')
    }

    const dates = Array.from({ length: 30 }, (_, index) => {
      const date = new Date()
      date.setDate(date.getDate() - index)
      return date
    })

    const balances = await Promise.all(
      dates.map(async (date): Promise<[Date, string]> => {
        const balance = await balanceRepository.findTotalBalanceByUserId(
          userId,
          currency.usdExchangeRate,
          date
        )
        return [date, balance]
      })
    )

    return balances
  }

  return {
    findBalanceByUserIdInCurrency,
    findBalanceStatisticsForLast30Days,
    findBalancesByAccountIds: balanceRepository.findBalancesByAccountIds,
  }
}, 'BalanceService')
