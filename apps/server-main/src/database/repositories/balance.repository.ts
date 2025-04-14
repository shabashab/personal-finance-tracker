import {
  AccountId,
  accounts,
  currencies,
  transactions,
  UserId,
} from '@database/schema'
import { defineRepository } from './_utils'
import { eq, inArray, sql } from 'drizzle-orm'
import { Decimal } from 'decimal.js'

const createBalanceSql = (targetCurrencyExchangeRateUsd: string) => sql<string>`
  COALESCE(
    SUM(
      CASE WHEN ${eq(transactions.kind, 'INCOME')} 
      THEN ${transactions.amount} * (${targetCurrencyExchangeRateUsd} / ${transactions.currencyUsdExchangeRate})
      ELSE -1 * ${transactions.amount} * (${targetCurrencyExchangeRateUsd} / ${transactions.currencyUsdExchangeRate})
    END), 
  0)
  `

export const BalanceRepository = defineRepository(async (db) => {
  const findTotalBalanceByUserId = async (
    userId: UserId,
    targetCurrencyExchangeRateUsd: string
  ) => {
    const [initialBalances] = await db
      .select({
        initialBalance: sql<string>`
          COALESCE(SUM(
            ${accounts.initialBalance} * (${targetCurrencyExchangeRateUsd} / ${currencies.usdExchangeRate})
          ), 0)`.as('initialBalance'),
      })
      .from(accounts)
      .innerJoin(currencies, eq(currencies.id, accounts.currencyId))
      .where(eq(accounts.userId, userId))

    const [result] = await db
      .select({
        balance: createBalanceSql(targetCurrencyExchangeRateUsd).as('balance'),
      })
      .from(accounts)
      .leftJoin(transactions, eq(transactions.accountId, accounts.id))
      .where(eq(accounts.userId, userId))

    return new Decimal(result?.balance ?? 0)
      .add(initialBalances?.initialBalance ?? 0)
      .toString()
  }

  const findBalancesByAccountIds = async (
    accountIds: AccountId[]
  ): Promise<Map<AccountId, string>> => {
    const results = await db
      .select({
        accountId: accounts.id,
        balance: sql<string>`
          ${accounts.initialBalance} + COALESCE(
            SUM(
              CASE WHEN ${eq(transactions.kind, 'INCOME')} 
              THEN ${transactions.amount}
              ELSE -1 * ${transactions.amount}
            END), 
          0)`.as('balance'),
      })
      .from(accounts)
      .leftJoin(transactions, eq(transactions.accountId, accounts.id))
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
