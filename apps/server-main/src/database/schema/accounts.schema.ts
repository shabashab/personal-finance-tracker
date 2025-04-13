import { jsonb, numeric, pgTable, text } from 'drizzle-orm/pg-core'
import { type Uuid } from '@utils'
import { brandedUuid, primaryUuid, timestamps } from './_utils'
import { type UserId, users } from './users.schema'
import { type CurrencyId, currencies } from './currencies.schema'

export type AccountId = Uuid<'accounts'>

export const accounts = pgTable('accounts', {
  id: primaryUuid<AccountId>(),

  name: text().notNull(),

  initialBalance: numeric().notNull().default('0'),

  integration: jsonb().$type<IntegrationData>(),

  userId: brandedUuid<UserId>()
    .notNull()
    .references(() => users.id),
  currencyId: brandedUuid<CurrencyId>()
    .notNull()
    .references(() => currencies.id),

  ...timestamps,
})

export type AccountSelect = typeof accounts.$inferSelect
export type AccountInsert = typeof accounts.$inferInsert

export interface MonobankIntegrationData {
  type: 'monobank'

  token: string
  accountId: string
}

export type IntegrationData = MonobankIntegrationData
