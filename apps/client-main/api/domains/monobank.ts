import type { MonoBankAccount } from '~/models/account.model'
import { api } from '../api'

export const monobank = {
  prefetchTokenInfo: api.defineJsonEndpoint<
    {
      apiKey: string
    },
    {
      name: string
      accounts: MonoBankAccount[]
    }
  >({
    method: 'GET',
    url: (input) => `/integrations/monobankprefetch-token-info/${input.apiKey}`,
    output: 'naive',
    requireAuthentication: true,
  }),
}
