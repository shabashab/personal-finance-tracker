import { pgTable, numeric, pgEnum, text, timestamp } from 'drizzle-orm/pg-core'
import { type Uuid } from '@utils'
import { brandedUuid, primaryUuid, timestamps } from './_utils'
import { type AccountId, accounts } from './accounts.schema'
import { type CategoryId, categories } from './categories.schema'

export type TransactionId = Uuid<'transactions'>

export const transactionKind = pgEnum('transaction_kind', ['INCOME', 'EXPENSE'])

export const transactions = pgTable('transactions', {
  id: primaryUuid<TransactionId>(),

  amount: numeric().notNull(),
  kind: transactionKind().notNull(),

  // Exchange rate on moment of transaction creation, so we would always have accurate historical data
  currencyUsdExchangeRate: numeric().notNull(),

  comment: text(),

  performedAt: timestamp({
    mode: 'date',
    precision: 3,
    withTimezone: true,
  }).notNull(),

  categoryId: brandedUuid<CategoryId>().references(() => categories.id),
  accountId: brandedUuid<AccountId>()
    .notNull()
    .references(() => accounts.id),

  ...timestamps,
})
