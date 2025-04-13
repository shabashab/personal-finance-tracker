import { categoryDto } from '@dtos/category.dto'
import { z } from 'zod'

export const createCategoryRequestSchema = z.object({
  name: z.string().min(1).max(100),
  kind: z.enum(['INCOME', 'EXPENSE']),
})

export const createCategoryResponseDto = categoryDto
