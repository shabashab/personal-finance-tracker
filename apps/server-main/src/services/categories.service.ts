import { CategoriesRepository } from '@database/repositories/categories.respository'
import { CategoryKind, UserId } from '@database/schema'
import { defineProvider } from '@mikrokit/di'

export const CategoriesService = defineProvider(async (injector) => {
  const categoriesRepository = await injector.inject(CategoriesRepository)

  const createNonDefaultCategoryForUserId = async (
    userId: UserId,
    name: string,
    kind: CategoryKind
  ) => {
    return await categoriesRepository.createCategory(userId, name, kind, false)
  }

  return {
    findCategoriesByUserId: categoriesRepository.findCategoriesByUserId,
    createNonDefaultCategoryForUserId,
  }
}, 'CategoriesService')
