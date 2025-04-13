import { transactionDto } from '@dtos/transaction.dto'
import { z } from 'zod'

export const updateTransactionRequestSchema = z.object({
  amount: z.number().optional(),
  kind: z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.string().uuid().optional(),
})

export const updateTransactionRequestParamsSchema = z.object({
  transactionId: z.string().uuid(),
})

export const updateTransactionResponseDto = transactionDto
