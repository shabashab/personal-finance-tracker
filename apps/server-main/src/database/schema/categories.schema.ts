import { pgTable, pgEnum, text } from 'drizzle-orm/pg-core'
import { type Uuid } from '@utils'
import { brandedUuid, primaryUuid, timestamps } from './_utils'
import { type UserId, users } from './users.schema'

export type CategoryId = Uuid<'categories'>

export const categoryKind = pgEnum('category_kind', ['INCOME', 'EXPENSE'])

export const categories = pgTable('categories', {
  id: primaryUuid<CategoryId>(),

  name: text().notNull(),
  kind: categoryKind().notNull(),

  userId: brandedUuid<UserId>()
    .notNull()
    .references(() => users.id),

  ...timestamps,
})
