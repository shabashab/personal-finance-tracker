import { Uuid } from '@utils'

import { brandedUuid, primaryUuid, timestamps } from './_utils'
import { pgTable, varchar } from 'drizzle-orm/pg-core'

import { UserId, users } from './users.schema'

export type AuthPasswordId = Uuid<'auth_passwords'>

export const authPasswords = pgTable('auth_passwords', {
  id: primaryUuid<AuthPasswordId>(),

  userId: brandedUuid<UserId>()
    .references(() => users.id)
    .notNull(),

  // BCrypt hashed passwords and secrets have 72 character limit.
  passwordHash: varchar('password_hash', { length: 72 }).notNull(),

  ...timestamps,
})

export type AuthPasswordSelect = typeof authPasswords.$inferSelect
export type AuthPasswordInsert = typeof authPasswords.$inferInsert
