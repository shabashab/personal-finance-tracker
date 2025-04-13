import { Uuid } from '@utils'
import { primaryUuid, timestamps } from './_utils'
import { boolean, pgTable, text } from 'drizzle-orm/pg-core'
import { categoryKind } from './categories.schema'

export type CategoryTemplateId = Uuid<'categories_templates'>

export const categoriesTemplates = pgTable('categories_templates', {
  id: primaryUuid<CategoryTemplateId>(),

  name: text().notNull(),
  kind: categoryKind().notNull(),

  isDefault: boolean().notNull().default(false),

  ...timestamps,
})

export type CategoryTemplateSelect = typeof categoriesTemplates.$inferSelect
export type CategoryTemplateInsert = typeof categoriesTemplates.$inferInsert
