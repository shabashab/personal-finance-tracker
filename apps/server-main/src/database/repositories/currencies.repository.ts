import { and, eq, isNull, or } from 'drizzle-orm'
import { defineRepository } from './_utils'
import { currencies, CurrencyId, UserId } from '@database/schema'

export const CurrenciesRepository = defineRepository(async (db) => {
  const findCurrencyById = async (currencyId: CurrencyId) => {
    const currency = await db.query.currencies.findFirst({
      where: eq(currencies.id, currencyId),
    })

    return currency
  }

  const findAllCurrenciesAvailableToUserId = async (userId: UserId) => {
    return await db.query.currencies.findMany({
      where: or(isNull(currencies.userId), eq(currencies.userId, userId)),
    })
  }

  const createCurrency = async (
    name: string,
    usdExchangeRate: string,
    userId?: UserId
  ) => {
    const [inserted] = await db
      .insert(currencies)
      .values({
        name,
        usdExchangeRate,
        userId,
      })
      .returning()

    if (!inserted) {
      throw new Error('Failed to create currency')
    }

    return inserted
  }

  const findCurrencyByNameAndUserId = async (name: string, userId: UserId) => {
    const currency = await db.query.currencies.findFirst({
      where: and(
        eq(currencies.name, name),
        or(isNull(currencies.userId), eq(currencies.userId, userId))
      ),
    })

    return currency
  }

  return {
    findAllCurrenciesAvailableToUserId,
    createCurrency,
    findCurrencyByNameAndUserId,
    findCurrencyById,
  }
}, 'CurrenciesRepository')
