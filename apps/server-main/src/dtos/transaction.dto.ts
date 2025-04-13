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
    amount: z.string(),
    kind: z.enum(['INCOME', 'EXPENSE']),
    currencyUsdExchangeRate: z.string(),
    categoryId: z.string().uuid().nullable(),
    performedAt: z.date().nullable(),
  }),
  (transaction: TransactionSelect) => {
    return {
      id: transaction.id,
      accountId: transaction.accountId,
      amount: transaction.amount.toString(),
      kind: transaction.kind,
      currencyUsdExchangeRate: transaction.currencyUsdExchangeRate.toString(),
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
