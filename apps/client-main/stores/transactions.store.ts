import { transactions } from '~/api/domains/transactions'
import type { Transaction } from '~/models/transaction.model'

export const useTransactionsStore = defineStore('transactions', () => {
  const filteredTransaction = ref<Transaction[]>([])

  const fetchTransactions = async (accountId: string[]) => {
    const result = await transactions.filterTransactions.execute({
      limit: 1000,
      offset: 0,
      accountId,
    })

    if (result.success) {
      filteredTransaction.value = result.output
    }
  }

  return {
    filteredTransaction,
    fetchTransactions,
  }
})
