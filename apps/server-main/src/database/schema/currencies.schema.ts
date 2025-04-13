import { numeric, pgTable, text } from 'drizzle-orm/pg-core'
import { type Uuid } from '@utils'
import { brandedUuid, primaryUuid, timestamps } from './_utils'
import { type UserId, users } from './users.schema'

export type CurrencyId = Uuid<'currencies'>

export const currencies = pgTable('currencies', {
  id: primaryUuid<CurrencyId>(),

  name: text().notNull().unique(),
  usdExchangeRate: numeric().notNull(),

  // For currencies, created by specific users
  userId: brandedUuid<UserId>().references(() => users.id),

  ...timestamps,
})

export type CurrencySelect = typeof currencies.$inferSelect
