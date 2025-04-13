import { TransactionFilter } from '@interfaces/transaction/transaction-filter.interface'
import { defineRepository } from './_utils'
import {
  AccountId,
  accounts,
  categories,
  CategoryId,
  TransactionId,
  TransactionKind,
  transactions,
  UserId,
} from '@database/schema'
import { PaginationQuery } from '@interfaces/pagination-query.interface'
import { desc, eq, gte, inArray, lte } from 'drizzle-orm'
import { FullTransactionSelect } from '@database/types/full-transaction-select.type'
import { UpdateTransactionData } from '@interfaces/transaction/update-transaction-data.interface'

export const TransactionsRepository = defineRepository(async (db) => {
  const findFullTransactionById = async (
    transactionId: TransactionId
  ): Promise<FullTransactionSelect | undefined> => {
    const [transaction] = await db
      .select()
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.id, transactionId))

    return transaction
      ? {
          ...transaction.transactions,
          account: transaction.accounts,
          category: transaction.categories,
        }
      : undefined
  }

  const createTransaction = async (data: {
    amount: string
    kind: TransactionKind
    currencyUsdExchangeRate: string
    accountId: AccountId
    categoryId: CategoryId
    performedAt?: Date
  }) => {
    const [inserted] = await db
      .insert(transactions)
      .values({
        accountId: data.accountId,
        amount: data.amount,
        categoryId: data.categoryId,
        currencyUsdExchangeRate: data.currencyUsdExchangeRate,
        performedAt: data.performedAt,
        kind: data.kind,
      })
      .returning()

    if (!inserted) {
      throw new Error('Transaction creation failed')
    }

    return inserted
  }

  const findFullTransactionsByUserIdAndFilterPaginated = async (
    userId: UserId,
    filter: TransactionFilter,
    pagination: PaginationQuery
  ): Promise<FullTransactionSelect[]> => {
    const query = db
      .select()
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(accounts.userId, userId))
      .$dynamic()

    if (filter.minDate) {
      query.where(gte(transactions.performedAt, filter.minDate))
    }

    if (filter.maxDate) {
      query.where(lte(transactions.performedAt, filter.maxDate))
    }

    if (filter.accountId) {
      query.where(inArray(accounts.id, filter.accountId))
    }

    if (filter.categoryId) {
      query.where(inArray(transactions.categoryId, filter.categoryId))
    }

    query
      .orderBy(desc(transactions.performedAt))
      .offset(pagination.offset)
      .limit(pagination.limit)

    const selectedTransactions = await query.execute()

    return selectedTransactions.map((item) => ({
      ...item.transactions,
      account: item.accounts,
      category: item.categories,
    }))
  }

  const deleteTransactionById = async (id: TransactionId) => {
    await db.delete(transactions).where(eq(transactions.id, id))
  }

  const updateTransactionById = async (
    id: TransactionId,
    updateData: UpdateTransactionData
  ) => {
    const [updated] = await db
      .update(transactions)
      .set({
        amount: updateData.amount ? `${updateData.amount}` : undefined,
        kind: updateData.kind,
        categoryId: updateData.categoryId,
      })
      .where(eq(transactions.id, id))
      .returning()

    if (!updated) {
      throw new Error('Transaction update failed')
    }

    return updated
  }

  return {
    createTransaction,
    findFullTransactionsByUserIdAndFilterPaginated,
    findFullTransactionById,
    updateTransactionById,
    deleteTransactionById,
  }
}, 'TransactionsRepository')
