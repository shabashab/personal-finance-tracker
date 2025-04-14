import type { Currency } from '~/models/currency.model'
import { api } from '../api'

export const currencies = {
  getCurrencies: api.defineJsonEndpoint<void, Currency[]>({
    method: 'GET',
    url: '/currencies',
    output: 'naive',
    body: 'input',
    requireAuthentication: true,
  }),
}
