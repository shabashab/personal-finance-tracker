import { FullTransactionSelect } from '@database/types/full-transaction-select.type'
import { defineDto, paginationDataSchema } from '@dtos/_utils'
import { fullTransactionDto } from '@dtos/transaction.dto'
import { z } from 'zod'

export const getTransactionsRequestQuerySchema = paginationDataSchema.extend({
  minDate: z.string().datetime().optional(),
  maxDate: z.string().datetime().optional(),
  accountId: z.string().uuid().array().optional(),
  categoryId: z.string().uuid().array().optional(),
})

export const getTransactionsResponseDto = defineDto(
  fullTransactionDto.schema.array(),
  (transactions: FullTransactionSelect[]) => {
    return transactions.map((transaction) => {
      return fullTransactionDto(transaction)
    })
  }
)
