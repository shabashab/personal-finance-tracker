import { z } from 'zod'
import { defineDto } from './_utils'
import { CategorySelect } from '@database/schema'

export const categoryDto = defineDto(
  z.object({
    id: z.string(),
    name: z.string(),
    kind: z.enum(['INCOME', 'EXPENSE']),
    isDefault: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
  (category: CategorySelect) => {
    return {
      id: category.id,
      name: category.name,
      kind: category.kind,
      isDefault: category.isDefault,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }
  }
)
