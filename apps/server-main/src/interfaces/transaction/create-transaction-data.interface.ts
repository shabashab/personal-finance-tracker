import { AccountId, CategoryId, TransactionKind } from '@database/schema'

export interface CreateTransactionData {
  amount: number
  kind: TransactionKind
  accountId: AccountId
  categoryId?: CategoryId
  performedAt?: Date
}
