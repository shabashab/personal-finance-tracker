import { CategoriesService } from '@services/categories.service'
import { defineController } from '../_utils'
import { getCategoriesResponseDto } from './defs/get-categories.def'
import {
  createCategoryRequestSchema,
  createCategoryResponseDto,
} from './defs/create-category.def'

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

    r.auth.post(
      '/',
      {
        docs: {
          tags: ['categories'],
          description: 'Create a new category',
        },
        request: {
          body: createCategoryRequestSchema,
        },
        response: createCategoryResponseDto.schema,
      },
      async ({ user, body }, reply) => {
        const category =
          await categoriesService.createNonDefaultCategoryForUserId(
            user.id,
            body.name,
            body.kind
          )

        reply.code(201)
        return createCategoryResponseDto(category)
      }
    )
  }
)
