import { api } from '../api'
import type { Category } from '~/models/category.model'
import type { CreateCategoryDto } from '../dto/create-category.dto'

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
}
