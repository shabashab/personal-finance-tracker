import { Uuid } from '@utils'
import { pgTable, timestamp } from 'drizzle-orm/pg-core'
import { brandedUuid, primaryUuid, timestamps } from './_utils'

import { UserId, users } from './users.schema'

export type EmailVerificationTokenId = Uuid<'email_verification_tokens'>

export const emailVerificationTokens = pgTable('email_verification_tokens', {
  id: primaryUuid<EmailVerificationTokenId>(),

  userId: brandedUuid<UserId>()
    .references(() => users.id)
    .notNull(),

  expiresAt: timestamp({
    mode: 'date',
    precision: 3,
    withTimezone: true,
  }).notNull(),

  ...timestamps,
})

export type EmailVerificationTokenSelect =
  typeof emailVerificationTokens.$inferSelect
export type EmailVerificationTokenInsert =
  typeof emailVerificationTokens.$inferInsert
