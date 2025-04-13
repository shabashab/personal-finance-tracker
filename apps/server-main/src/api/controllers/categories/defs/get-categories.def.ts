import { CategorySelect } from '@database/schema'
import { defineDto } from '@dtos/_utils'
import { categoryDto } from '@dtos/category.dto'

export const getCategoriesResponseDto = defineDto(
  categoryDto.schema.array(),
  (categories: CategorySelect[]) => {
    return categories.map((category) => categoryDto(category))
  }
)
