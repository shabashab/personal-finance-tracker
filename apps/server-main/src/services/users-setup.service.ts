import { UserId } from '@database/schema'
import { defineProvider } from '@mikrokit/di'
import { CategoriesTemplatesService } from './categories-templates.service'

export const UsersSetupService = defineProvider(async (injector) => {
  const categoriesTemplatesService = await injector.inject(
    CategoriesTemplatesService
  )

  const setupUserById = async (userId: UserId) => {
    await categoriesTemplatesService.createUserCategoriesFromTemplates(userId)
  }

  return {
    setupUserById,
  }
}, 'UsersSetupService')
