import { Uuid } from '@utils'

import { brandedUuid, primaryUuid, timestamps } from './_utils'
import { pgTable, timestamp } from 'drizzle-orm/pg-core'

import { UserId, users } from './users.schema'
import { sql } from 'drizzle-orm'

export type SessionId = Uuid<'sessions'>

export const sessions = pgTable('sessions', {
  id: primaryUuid<SessionId>(),

  userId: brandedUuid<UserId>()
    .references(() => users.id)
    .notNull(),

  // Session expires after 1 day if not specified otherwise.
  expiresAt: timestamp().default(sql`now() + interval '1 day'`),

  ...timestamps,
})

export type SessionSelect = typeof sessions.$inferSelect
