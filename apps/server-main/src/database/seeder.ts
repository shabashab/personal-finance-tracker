import { Container } from '@mikrokit/di'
import { Database } from './drizzle'
import { Logger } from '@core/logger'
import { CurrenciesSeeder } from './seeders/currencies.seeder'

export type SeedEnvironment = 'development' | 'production'

export const seedDatabase = async (
  container: Container,
  environment: SeedEnvironment
) => {
  const db = await container.inject(Database)
  const logger = await container.inject(Logger)

  const currenciesSeeder = await container.inject(CurrenciesSeeder)

  await db.transaction(async (tx) => {
    await currenciesSeeder(tx)
  })

  logger.info('Database seeded')
}
