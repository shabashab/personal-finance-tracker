import { successfulOperationDto } from '@dtos/successful-operation.dto'
import { z } from 'zod'

export const deleteTransactionRequestParamsSchema = z.object({
  transactionId: z.string().uuid(),
})

export const deleteTransactionResponseDto = successfulOperationDto
