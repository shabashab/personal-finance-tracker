import type { CategoryKind } from '~/models/category.model'

export interface CreateTransactionDto {
  amount: number
  kind: CategoryKind
  accountId: string
  categoryId: string
  performedAt: Date
}
