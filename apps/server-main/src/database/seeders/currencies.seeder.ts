import { currencies } from '@database/schema'
import { defineSeeder } from './_utils'

export const CurrenciesSeeder = defineSeeder(async (db) => {
  await db
    .insert(currencies)
    .values([
      {
        name: 'USD',
        usdExchangeRate: '1',
      },
      {
        name: 'UAH',
        usdExchangeRate: '41.41',
      },
      {
        name: 'EUR',
        usdExchangeRate: '1.14',
      },
    ])
    .onConflictDoNothing()
}, 'CurrenciesSeeder')
