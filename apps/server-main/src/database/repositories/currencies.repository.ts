import { eq, isNull, or } from 'drizzle-orm'
import { defineRepository } from './_utils'
import { currencies, UserId } from '@database/schema'

export const CurrenciesRepository = defineRepository(async (db) => {
  const findAllCurrenciesAvailableToUserId = async (userId: UserId) => {
    return await db.query.currencies.findMany({
      where: or(isNull(currencies.userId), eq(currencies.userId, userId)),
    })
  }

  return {
    findAllCurrenciesAvailableToUserId,
  }
}, 'CurrenciesRepository')
