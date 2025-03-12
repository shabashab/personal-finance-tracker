import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core'
import { primaryUuid, timestamps } from './_utils'
import { type Uuid } from '@utils'

export type UserId = Uuid<'users'>

export const userRoles = pgEnum('user_roles', ['USER', 'ADMIN'])

export const users = pgTable('users', {
  id: primaryUuid<UserId>(),

  roles: userRoles().array().default(['USER']).notNull(),

  email: text().unique().notNull(),
  passwordHash: text().notNull(),

  ...timestamps,
})

export type UserSelect = typeof users.$inferSelect
export type UserRole = (typeof userRoles.enumValues)[number]
