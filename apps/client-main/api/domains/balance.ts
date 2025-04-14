import { api } from '../api'
import type { StatisticsInputDto } from '../dto/statistics-input.dto'

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

  getStatistics: api.defineJsonEndpoint<
    StatisticsInputDto,
    Record<string, string>[]
  >({
    method: 'GET',
    url: '/balance/statistics',
    output: 'naive',
    requireAuthentication: true,
    query: 'input',
  }),
}
