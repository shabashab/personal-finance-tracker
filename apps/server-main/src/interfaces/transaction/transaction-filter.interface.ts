import { AccountId, CategoryId } from '@database/schema'

export interface TransactionFilter {
  minDate?: Date
  maxDate?: Date
  accountId?: AccountId[]
  categoryId?: CategoryId[]
}
