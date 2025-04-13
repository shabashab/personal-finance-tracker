import { CategoriesRepository } from '@database/repositories/categories.respository'
import { defineProvider } from '@mikrokit/di'

export const CategoriesService = defineProvider(async (injector) => {
  const categoriesRepository = await injector.inject(CategoriesRepository)

  return {}
}, 'CategoriesService')
