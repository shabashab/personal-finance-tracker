import type { CategoryKind } from '~/models/category.model'

export interface CreateCategoryDto {
  name: string
  kind: CategoryKind
}
