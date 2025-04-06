import { Uuid } from '@utils'

import { primaryUuid, timestamps } from './_utils'
import { pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core'

export type UserId = Uuid<'users'>

export const userRole = pgEnum('user_role', ['ADMIN', 'USER'])

export const users = pgTable('users', {
  id: primaryUuid<UserId>(),

  email: varchar('email').unique(),

  roles: userRole().array().notNull().default(['USER']),

  ...timestamps,
})

export type UserRole = (typeof userRole.enumValues)[number]

export type UserSelect = typeof users.$inferSelect
export type UserInsert = typeof users.$inferInsert
