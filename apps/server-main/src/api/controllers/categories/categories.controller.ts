import { CategoriesService } from '@services/categories.service'
import { defineController } from '../_utils'
import { getCategoriesResponseDto } from './defs/get-categories.def'

export const CategoriesController = defineController(
  '/categories',
  async (r, injector) => {
    const categoriesService = await injector.inject(CategoriesService)

    r.auth.get(
      '/',
      {
        docs: {
          tags: ['categories'],
          description: 'Get all categories available to current user',
        },
        response: getCategoriesResponseDto.schema,
      },
      async ({ user }) => {
        const categories = await categoriesService.findCategoriesByUserId(
          user.id
        )

        return getCategoriesResponseDto(categories)
      }
    )
  }
)
