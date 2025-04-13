import { AccountId, accounts, transactions, UserId } from '@database/schema'
import { defineRepository } from './_utils'
import { eq, inArray, sql } from 'drizzle-orm'

const createBalanceSql = (targetCurrencyExchangeRateUsd: string) => sql<string>`
  COALESCE(
    SUM(
      CASE WHEN ${eq(transactions.kind, 'INCOME')} 
      THEN ${transactions.amount} * (${transactions.currencyUsdExchangeRate} / ${targetCurrencyExchangeRateUsd})
      ELSE -1 * ${transactions.amount} * (${transactions.currencyUsdExchangeRate} / ${targetCurrencyExchangeRateUsd})
    END), 
  0)
  `

export const BalanceRepository = defineRepository(async (db) => {
  const findTotalBalanceByUserId = async (
    userId: UserId,
    targetCurrencyExchangeRateUsd: string
  ) => {
    const [result] = await db
      .select({
        balance: createBalanceSql(targetCurrencyExchangeRateUsd).as('balance'),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(eq(accounts.userId, userId))

    if (!result) {
      return '0'
    }

    return result.balance
  }

  const findBalancesByAccountIds = async (
    accountIds: AccountId[]
  ): Promise<Map<AccountId, string>> => {
    const results = await db
      .select({
        accountId: accounts.id,
        balance: sql<string>`
        COALESCE(
          SUM(
            CASE WHEN ${eq(transactions.kind, 'INCOME')} 
            THEN ${transactions.amount}
            ELSE -1 * ${transactions.amount}
          END), 
        0)`.as('balance'),
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(inArray(accounts.id, accountIds))
      .groupBy(accounts.id)

    const result = new Map<AccountId, string>()

    for (const resultEntry of results) {
      result.set(resultEntry.accountId, resultEntry.balance)
    }

    return result
  }

  return {
    findTotalBalanceByUserId,
    findBalancesByAccountIds,
  }
}, 'BalanceRepository')
