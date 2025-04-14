import type { TransactionKind } from '~/models/transaction.model'

export interface FilterTransactionsDto {
  limit: number
  offset: number
  accountId: string[]
}

export interface CreateTransactionDto {
  amount: number
  kind: TransactionKind
  accountId: string
  categoryId: string
}
