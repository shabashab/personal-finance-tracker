import { api } from '../api'
import type { Account } from '~/models/account.model'
import type { CreateAccountDto } from '../dto/create-account.dto'

export const account = {
  getAccounts: api.defineJsonEndpoint<void, Account[]>({
    method: 'GET',
    url: '/accounts',
    output: 'naive',
    body: 'input',
    requireAuthentication: true,
  }),

  createAccount: api.defineJsonEndpoint<CreateAccountDto, void>({
    method: 'POST',
    url: '/accounts',
    output: 'naive',
    body: 'input',
    requireAuthentication: true,
  }),
}
