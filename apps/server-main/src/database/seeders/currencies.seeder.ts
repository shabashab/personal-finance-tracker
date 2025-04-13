import { currencies, CurrencyInsert } from '@database/schema'
import { defineSeeder } from './_utils'
import { eq } from 'drizzle-orm'

export const CurrenciesSeeder = defineSeeder(async (db) => {
  const currenciesToInsert: CurrencyInsert[] = [
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
  ]

  for (const currency of currenciesToInsert) {
    const existingCurrency = await db.query.currencies.findFirst({
      where: eq(currencies.name, currency.name),
    })

    if (existingCurrency) {
      continue
    }

    await db.insert(currencies).values(currency)
  }
}, 'CurrenciesSeeder')
