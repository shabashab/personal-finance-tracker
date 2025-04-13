import {
  categoriesTemplates,
  CategoryTemplateInsert,
} from '@database/schema/categories-templates.schema'
import { defineSeeder } from './_utils'
import { and, eq } from 'drizzle-orm'

export const CategoriesTemplatesSeeder = defineSeeder(async (db) => {
  const categoriesTemplatesToInsert: CategoryTemplateInsert[] = [
    {
      kind: 'INCOME',
      name: 'income_default',
      isDefault: true,
    },
    {
      kind: 'INCOME',
      name: 'salary',
    },
    {
      kind: 'INCOME',
      name: 'gift',
    },
    {
      kind: 'INCOME',
      name: 'sell',
    },
    {
      kind: 'EXPENSE',
      name: 'expense_default',
      isDefault: true,
    },
    {
      kind: 'EXPENSE',
      name: 'taxi',
    },
    {
      kind: 'EXPENSE',
      name: 'public_transport',
    },
    {
      kind: 'EXPENSE',
      name: 'products',
    },
    {
      kind: 'EXPENSE',
      name: 'subscriptions',
    },
  ]

  for (const categoryTemplate of categoriesTemplatesToInsert) {
    const existingCategoryTemplate =
      await db.query.categoriesTemplates.findFirst({
        where: () =>
          and(
            eq(categoriesTemplates.kind, categoryTemplate.kind),
            eq(categoriesTemplates.name, categoryTemplate.name)
          ),
      })

    if (existingCategoryTemplate) {
      continue
    }

    await db.insert(categoriesTemplates).values(categoryTemplate)
  }
}, 'CategoriesTemplatesSeeder')
