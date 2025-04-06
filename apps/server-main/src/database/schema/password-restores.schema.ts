import { Uuid } from '@utils'
import { brandedUuid, primaryUuid, timestamps } from './_utils'

import { pgTable, timestamp } from 'drizzle-orm/pg-core'

import { AuthPasswordId, authPasswords } from './auth-passwords.schema'

export type PasswordRestoreId = Uuid<'password_restores'>

export const passwordRestores = pgTable('password_restores', {
  id: primaryUuid<PasswordRestoreId>(),

  authPasswordId: brandedUuid<AuthPasswordId>()
    .references(() => authPasswords.id)
    .notNull(),

  expiresAt: timestamp({
    mode: 'date',
    precision: 3,
    withTimezone: true,
  }).notNull(),

  ...timestamps,
})

export type PasswordRestoreSelect = typeof passwordRestores.$inferSelect
export type PasswordRestoreInsert = typeof passwordRestores.$inferInsert
