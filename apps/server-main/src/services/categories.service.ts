import { CategoriesRepository } from '@database/repositories/categories.repository'
import { CategoryKind, CurrencyId, UserId } from '@database/schema'
import { defineProvider } from '@mikrokit/di'
import { CurrenciesService } from './currencies.service'
import { BadRequestException } from '@api/exceptions/bad-request.exception'
import dayjs from 'dayjs'

export const CategoriesService = defineProvider(async (injector) => {
  const categoriesRepository = await injector.inject(CategoriesRepository)
  const currenciesService = await injector.inject(CurrenciesService)

  const createNonDefaultCategoryForUserId = async (
    userId: UserId,
    name: string,
    kind: CategoryKind
  ) => {
    return await categoriesRepository.createCategory(userId, name, kind, false)
  }

  const findCategoriesStatisticsByUserId = async (
    userId: UserId,
    currencyId: CurrencyId
  ) => {
    const currency = await currenciesService.findCurrencyById(currencyId)

    if (!currency) {
      throw new BadRequestException('Currency not found')
    }

    // write code for "periods" variabl that will generate 4 months starting from first to last day of the month
    // months should be relative to current date
    const currentMonthStart = dayjs().startOf('month')
    const currentMonthEnd = dayjs().endOf('month')

    const periods = [
      {
        from: currentMonthStart.subtract(3, 'month').toDate(),
        to: currentMonthEnd.subtract(3, 'month').toDate(),
      },
      {
        from: currentMonthStart.subtract(2, 'month').toDate(),
        to: currentMonthEnd.subtract(2, 'month').toDate(),
      },
      {
        from: currentMonthStart.subtract(1, 'month').toDate(),
        to: currentMonthEnd.subtract(1, 'month').toDate(),
      },
      {
        from: currentMonthStart.toDate(),
        to: currentMonthEnd.toDate(),
      },
    ]

    const incomeStatisticsPart = await Promise.all(
      periods.map(async (period) => {
        const data =
          await categoriesRepository.findUserCategoryStatisticsByKindAndTimePeriod(
            userId,
            'INCOME',
            currency.usdExchangeRate,
            period
          )

        return data
      })
    )

    const expensesStatisticsPart = await Promise.all(
      periods.map(async (period) => {
        const data =
          await categoriesRepository.findUserCategoryStatisticsByKindAndTimePeriod(
            userId,
            'EXPENSE',
            currency.usdExchangeRate,
            period
          )

        return data
      })
    )

    return {
      incomes: incomeStatisticsPart,
      expenses: expensesStatisticsPart,
    }
  }

  return {
    findCategoriesByUserId: categoriesRepository.findCategoriesByUserId,
    createNonDefaultCategoryForUserId,
    findDefaultCategoryByUserIdAndKind:
      categoriesRepository.findDefaultCategoryByUserIdAndKind,
    findCategoryById: categoriesRepository.findCategoryById,
    findCategoriesStatisticsByUserId,
  }
}, 'CategoriesService')
