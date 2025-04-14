import { CategoriesService } from '@services/categories.service'
import { defineController } from '../_utils'
import { getCategoriesResponseDto } from './defs/get-categories.def'
import {
  createCategoryRequestSchema,
  createCategoryResponseDto,
} from './defs/create-category.def'
import {
  getCategoriesStatisticsRequestQuerySchema,
  getCategoriesStatisticsResponseDto,
} from './defs/get-categories-statistics.def'
import { asUuid } from '@utils'
import { CurrencyId } from '@database/schema'

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

    r.auth.get(
      '/statistics',
      {
        docs: {
          tags: ['categories'],
          description: 'Get categories statistics (for dashboard)',
        },
        request: {
          query: getCategoriesStatisticsRequestQuerySchema,
        },
        response: getCategoriesStatisticsResponseDto.schema,
      },
      async ({ user, query }) => {
        const statistics =
          await categoriesService.findCategoriesStatisticsByUserId(
            user.id,
            asUuid<CurrencyId>(query.currencyId)
          )

        return getCategoriesStatisticsResponseDto(
          statistics.incomes,
          statistics.expenses
        )
      }
    )
  }
)
