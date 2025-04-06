import { Uuid } from '@utils'
import { pgTable } from 'drizzle-orm/pg-core'
import { brandedUuid, primaryUuid, timestamps } from './_utils'

import { UserId, users } from './users.schema'

export type EmailVerificationId = Uuid<'email_verifications'>

export const emailVerifications = pgTable('email_verifications', {
  id: primaryUuid<EmailVerificationId>(),

  userId: brandedUuid<UserId>()
    .references(() => users.id)
    .notNull(),

  ...timestamps,
})

export type EmailVerificationSelect = typeof emailVerifications.$inferSelect
export type EmailVerificationInsert = typeof emailVerifications.$inferInsert
