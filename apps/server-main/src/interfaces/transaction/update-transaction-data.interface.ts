import { CategoryId } from '@database/schema'

export interface UpdateTransactionData {
  amount?: number
  kind?: 'INCOME' | 'EXPENSE'
  categoryId?: CategoryId
}
