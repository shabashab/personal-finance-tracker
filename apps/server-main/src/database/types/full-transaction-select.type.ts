import {
  AccountSelect,
  CategorySelect,
  TransactionSelect,
} from '@database/schema'

export type FullTransactionSelect = TransactionSelect & {
  account: AccountSelect
  category: CategorySelect
}
