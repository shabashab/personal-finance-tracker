import { Database } from '@database/drizzle'
import { CategoriesTemplatesRepository } from '@database/repositories/categories-templates.repository'
import { CategoriesRepository } from '@database/repositories/categories.respository'
import { UserId } from '@database/schema'
import { defineProvider } from '@mikrokit/di'

export const CategoriesTemplatesService = defineProvider(async (injector) => {
  const categoriesTemplatesRepository = await injector.inject(
    CategoriesTemplatesRepository
  )
  const categoriesRepository = await injector.inject(CategoriesRepository)
  const db = await injector.inject(Database)

  const createUserCategoriesFromTemplates = async (userId: UserId) => {
    const templates =
      await categoriesTemplatesRepository.findAllCategoriesTemplates()

    await db.transaction(async (tx) => {
      const txCategoriesRepository =
        await categoriesRepository.withTransaction(tx)

      for (const template of templates) {
        await txCategoriesRepository.createCategory(
          userId,
          template.name,
          template.kind,
          template.isDefault
        )
      }
    })
  }

  return {
    createUserCategoriesFromTemplates,
  }
}, 'CategoriesTemplatesService')
