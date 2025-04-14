import { api } from '../api'
import type {
  CreateTransactionDto,
  FilterTransactionsDto,
} from '../dto/transaction.dto'
import type { Transaction } from '~/models/transaction.model'

export const transactions = {
  filterTransactions: api.defineJsonEndpoint<
    FilterTransactionsDto,
    Transaction[]
  >({
    method: 'GET',
    url: '/transactions',
    query: 'input',
    output: 'naive',
    requireAuthentication: true,
  }),

  createTransaction: api.defineJsonEndpoint<CreateTransactionDto, void>({
    method: 'POST',
    url: '/transactions',
    body: 'input',
    output: 'naive',
    requireAuthentication: true,
  }),
}
