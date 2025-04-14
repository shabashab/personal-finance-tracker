import { api } from '../api'
import type { Category } from '~/models/category.model'

export const category = {
  getCategory: api.defineJsonEndpoint<void, Category[]>({
    method: 'GET',
    url: '/categories',
    output: 'naive',
    requireAuthentication: true,
  }),
}
