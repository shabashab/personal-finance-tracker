import { TransactionsService } from '@services/transactions.service'
import { defineController } from '../_utils'
import {
  createTransactionRequestSchema,
  createTransactionResponseDto,
} from './defs/create-transaction.def'
import { asUuid, normalizeToArray } from '@utils'
import { AccountId, CategoryId, TransactionId } from '@database/schema'
import {
  getTransactionsRequestQuerySchema,
  getTransactionsResponseDto,
} from './defs/get-transactions.def'
import {
  deleteTransactionRequestParamsSchema,
  deleteTransactionResponseDto,
} from './defs/delete-transaction.def'
import {
  updateTransactionRequestParamsSchema,
  updateTransactionRequestSchema,
  updateTransactionResponseDto,
} from './defs/update-transaction.def'

export const TransactionsController = defineController(
  '/transactions',
  async (r, injector) => {
    const transactionsService = await injector.inject(TransactionsService)

    r.auth.post(
      '/',
      {
        docs: {
          tags: ['transactions'],
          description: 'Manually create a transaction for current user',
        },
        request: {
          body: createTransactionRequestSchema,
        },
        response: createTransactionResponseDto.schema,
      },
      async ({ body }, reply) => {
        const transaction = await transactionsService.createTransaction({
          accountId: asUuid<AccountId>(body.accountId),
          amount: body.amount,
          categoryId: asUuid<CategoryId>(body.categoryId),
          kind: body.kind,
          performedAt: body.performedAt
            ? new Date(body.performedAt)
            : undefined,
        })

        reply.code(201)
        return createTransactionResponseDto(transaction)
      }
    )

    r.auth.get(
      '/',
      {
        docs: {
          tags: ['transactions'],
          description: 'Find all users transactions with filters',
        },
        request: {
          query: getTransactionsRequestQuerySchema,
        },
        response: getTransactionsResponseDto.schema,
      },
      async ({ query, user }) => {
        const transactions =
          await transactionsService.findFullTransactionsByUserIdAndFilterPaginated(
            user.id,
            {
              accountId: normalizeToArray(query.accountId)?.map((id) =>
                asUuid<AccountId>(id)
              ),
              categoryId: normalizeToArray(query.categoryId)?.map((id) =>
                asUuid<CategoryId>(id)
              ),
              minDate: query.minDate ? new Date(query.minDate) : undefined,
              maxDate: query.maxDate ? new Date(query.maxDate) : undefined,
            },
            {
              limit: query.limit,
              offset: query.offset,
            }
          )

        return getTransactionsResponseDto(transactions)
      }
    )

    r.auth.delete(
      '/:transactionId',
      {
        docs: {
          tags: ['transactions'],
          description: 'Delete a transaction by id',
        },
        request: {
          params: deleteTransactionRequestParamsSchema,
        },
        response: deleteTransactionResponseDto.schema,
      },
      async ({ params, user }) => {
        await transactionsService.deleteTransactionByIdCheckingUserId(
          asUuid<TransactionId>(params.transactionId),
          user.id
        )

        return deleteTransactionResponseDto()
      }
    )

    r.auth.patch(
      '/:transactionId',
      {
        docs: {
          tags: ['transactions'],
          description: 'Update a transaction by id',
        },
        request: {
          body: updateTransactionRequestSchema,
          params: updateTransactionRequestParamsSchema,
        },
        response: updateTransactionResponseDto.schema,
      },
      async ({ body, params, user }) => {
        const updatedTransaction =
          await transactionsService.updateTransactionByIdCheckingUserId(
            asUuid<TransactionId>(params.transactionId),
            user.id,
            {
              amount: body.amount,
              kind: body.kind,
              categoryId: asUuid<CategoryId>(body.categoryId),
            }
          )

        return updateTransactionResponseDto(updatedTransaction)
      }
    )
  }
)
