import { AccountsService } from '@services/accounts.service'
import { defineController } from '../_utils'
import { getAccountsResponseDto } from './defs/get-accounts.def'
import {
  createAccountRequestSchema,
  createAccountResponseDto,
} from './defs/create-account.def'
import { asUuid } from '@utils'
import { CurrencyId } from '@database/schema'

export const AccountsController = defineController(
  '/accounts',
  async (r, injector) => {
    const accountsService = await injector.inject(AccountsService)

    r.auth.get(
      '/',
      {
        docs: {
          tags: ['accounts'],
          description: 'Get all current user accounts',
        },
        response: getAccountsResponseDto.schema,
      },
      async ({ user }) => {
        const accounts =
          await accountsService.findAllAccountsWithCurrencyByUserId(user.id)

        return getAccountsResponseDto(accounts)
      }
    )

    r.auth.post(
      '/',
      {
        docs: {
          tags: ['accounts'],
          description: 'Create new account for current user',
        },
        request: {
          body: createAccountRequestSchema,
        },
        response: createAccountResponseDto.schema,
      },
      async ({ user, body }, reply) => {
        const createdAccount = await accountsService.createAccount({
          userId: user.id,
          currencyId: asUuid<CurrencyId>(body.currencyId),
          name: body.name,
          integration: body.integration,
        })

        reply.code(201)
        return createAccountResponseDto(createdAccount)
      }
    )
  }
)
