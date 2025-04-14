import { z } from 'zod'
import { defineDto } from './_utils'
import {
  AccountSelect,
  CategorySelect,
  TransactionSelect,
} from '@database/schema'
import { accountDto } from './account.dto'
import { categoryDto } from './category.dto'
import { FullTransactionSelect } from '@database/types/full-transaction-select.type'

export const transactionDto = defineDto(
  z.object({
    id: z.string().uuid(),
    accountId: z.string().uuid(),
    amount: z.number(),
    kind: z.enum(['INCOME', 'EXPENSE']),
    currencyUsdExchangeRate: z.number(),
    categoryId: z.string().uuid().nullable(),
    performedAt: z.date().nullable(),
  }),
  (transaction: TransactionSelect) => {
    return {
      id: transaction.id,
      accountId: transaction.accountId,
      amount: Number.parseFloat(transaction.amount),
      kind: transaction.kind,
      currencyUsdExchangeRate: Number.parseFloat(
        transaction.currencyUsdExchangeRate
      ),
      categoryId: transaction.categoryId,
      performedAt: transaction.performedAt,
    }
  }
)

export const fullTransactionDto = defineDto(
  transactionDto.schema.extend({
    account: accountDto.schema,
    category: categoryDto.schema,
  }),
  (transaction: FullTransactionSelect) => {
    return {
      ...transactionDto(transaction),
      account: accountDto(transaction.account),
      category: categoryDto(transaction.category),
    }
  }
)
