import { api } from '../api'

export const balance = {
  getBalance: api.defineJsonEndpoint<
    { currencyId: string },
    { balance: number }
  >({
    method: 'GET',
    url: '/balance',
    query: 'input',
    output: 'naive',
    requireAuthentication: true,
  }),
}
