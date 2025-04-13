import { accounts, transactions, UserId } from '@database/schema'
import { defineRepository } from './_utils'
import { eq, sql } from 'drizzle-orm'

export const BalanceRepository = defineRepository(async (db) => {
  const findTotalBalanceByUserId = async (
    userId: UserId,
    targetCurrencyExchangeRateUsd: string
  ) => {
    const [result] = await db
      .select({
        balance: sql<string>`
          COALESCE(
            SUM(
              CASE WHEN ${eq(transactions.kind, 'INCOME')} 
              THEN ${transactions.amount} * (${transactions.currencyUsdExchangeRate} / ${targetCurrencyExchangeRateUsd})
              ELSE -1 * ${transactions.amount} * (${transactions.currencyUsdExchangeRate} / ${targetCurrencyExchangeRateUsd})
            END), 
          0)
        `.as('balance'),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(eq(accounts.userId, userId))

    if (!result) {
      return '0'
    }

    return result.balance
  }

  return {
    findTotalBalanceByUserId,
  }
}, 'BalanceRepository')
