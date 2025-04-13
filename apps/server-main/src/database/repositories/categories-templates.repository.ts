import { defineRepository } from './_utils'

export const CategoriesTemplatesRepository = defineRepository(async (db) => {
  const findAllCategoriesTemplates = async () => {
    return await db.query.categoriesTemplates.findMany()
  }

  return {
    findAllCategoriesTemplates,
  }
}, 'CategoriesTemplatesRepository')
