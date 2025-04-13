import { CategoriesRepository } from '@database/repositories/categories.respository'
import { CategoryKind, UserId } from '@database/schema'
import { Container } from '@mikrokit/di'

export const createCategory = async (
  container: Container,
  userId: UserId,
  name: string,
  kind: CategoryKind,
  isDefault: boolean
) => {
  const categoriesRepository = await container.inject(CategoriesRepository)

  await categoriesRepository.createCategory(userId, name, kind, isDefault)
}

export const findAllUserCategories = async (
  container: Container,
  userId: UserId
) => {
  const categoriesRepository = await container.inject(CategoriesRepository)

  return await categoriesRepository.findCategoriesByUserId(userId)
}
