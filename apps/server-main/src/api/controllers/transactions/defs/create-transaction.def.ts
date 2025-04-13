import { transactionDto } from '@dtos/transaction.dto'
import { z } from 'zod'

export const createTransactionRequestSchema = z.object({
  amount: z.number(),
  kind: z.enum(['INCOME', 'EXPENSE']),
  accountId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  performedAt: z.string().datetime().optional(),
})

export const createTransactionResponseDto = transactionDto
