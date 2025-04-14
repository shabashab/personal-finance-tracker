import { api } from '../api'
import type { Category, CategoryStatistics } from '~/models/category.model'
import type { CreateCategoryDto } from '../dto/create-category.dto'
import type { StatisticsInputDto } from '../dto/statistics-input.dto'

export const category = {
  getCategory: api.defineJsonEndpoint<void, Category[]>({
    method: 'GET',
    url: '/categories',
    output: 'naive',
    requireAuthentication: true,
  }),

  createCategory: api.defineJsonEndpoint<CreateCategoryDto, Category>({
    method: 'POST',
    url: '/categories',
    output: 'naive',
    body: 'input',
    requireAuthentication: true,
  }),

  getStatistics: api.defineJsonEndpoint<StatisticsInputDto, CategoryStatistics>(
    {
      method: 'GET',
      url: '/categories/statistics',
      output: 'naive',
      requireAuthentication: true,
      query: 'input',
    }
  ),
}
