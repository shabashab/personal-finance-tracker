import { TransactionsRepository } from '@database/repositories/transactions.repository'
import { CreateTransactionData } from '@interfaces/transaction/create-transaction-data.interface'
import { defineProvider } from '@mikrokit/di'
import { AccountsService } from './accounts.service'
import { BadRequestException } from '@api/exceptions/bad-request.exception'
import { CurrenciesService } from './currencies.service'
import { CategoriesService } from './categories.service'
import { CategoryId, TransactionId, UserId } from '@database/schema'
import { ForbiddenException } from '@api/exceptions/forbidden.exception'
import { UpdateTransactionData } from '@interfaces/transaction/update-transaction-data.interface'

export const TransactionsService = defineProvider(async (injector) => {
  const transactionsRepository = await injector.inject(TransactionsRepository)
  const accountsService = await injector.inject(AccountsService)
  const currenciesService = await injector.inject(CurrenciesService)
  const categoriesService = await injector.inject(CategoriesService)

  const createTransaction = async (data: CreateTransactionData) => {
    const account = await accountsService.findAccountById(data.accountId)

    if (!account) {
      throw new BadRequestException('Account not found')
    }

    const currency = await currenciesService.findCurrencyById(
      account.currencyId
    )

    if (!currency) {
      throw new BadRequestException('Invalid account, currency not found')
    }

    if (data.categoryId) {
      const category = await categoriesService.findCategoryById(data.categoryId)

      if (!category) {
        throw new BadRequestException('Invalid category id, category not found')
      }

      if (category.userId !== account.userId) {
        throw new BadRequestException(
          'Invalid category id, category does not belong to the user'
        )
      }
    }

    const categoryId = await findTransactionCategoryIdByCreateDataAndUserId(
      data,
      account.userId
    )

    return await transactionsRepository.createTransaction({
      accountId: data.accountId,
      amount: `${data.amount}`,
      categoryId,
      currencyUsdExchangeRate: currency.usdExchangeRate,
      kind: data.kind,
      performedAt: data.performedAt,
    })
  }

  const findTransactionCategoryIdByCreateDataAndUserId = async (
    createData: CreateTransactionData,
    userId: UserId
  ): Promise<CategoryId> => {
    if (createData.categoryId) {
      return createData.categoryId
    }

    const defaultCategory =
      await categoriesService.findDefaultCategoryByUserIdAndKind(
        userId,
        createData.kind
      )

    if (!defaultCategory) {
      throw new Error('Default category not found for user ' + userId)
    }

    return defaultCategory.id
  }

  const deleteTransactionByIdCheckingUserId = async (
    id: TransactionId,
    userId: UserId
  ) => {
    const transaction = await transactionsRepository.findFullTransactionById(id)

    if (!transaction) {
      throw new BadRequestException('Transaction not found')
    }

    if (transaction.account.userId !== userId) {
      throw new ForbiddenException()
    }

    await transactionsRepository.deleteTransactionById(id)
  }

  const updateTransactionByIdCheckingUserId = async (
    id: TransactionId,
    userId: UserId,
    updateData: UpdateTransactionData
  ) => {
    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('No data to update is provided')
    }

    const transaction = await transactionsRepository.findFullTransactionById(id)

    if (!transaction) {
      throw new BadRequestException('Transaction not found')
    }

    if (transaction.account.userId !== userId) {
      throw new ForbiddenException()
    }

    return await transactionsRepository.updateTransactionById(id, updateData)
  }

  return {
    createTransaction,
    findFullTransactionsByUserIdAndFilterPaginated:
      transactionsRepository.findFullTransactionsByUserIdAndFilterPaginated,
    deleteTransactionByIdCheckingUserId,
    updateTransactionByIdCheckingUserId,
  }
}, 'TransactionsService')
