import { Container } from '@mikrokit/di'
import { Database } from './drizzle'
import { Logger } from '@core/logger'
import { CurrenciesSeeder } from './seeders/currencies.seeder'
import { CategoriesTemplatesSeeder } from './seeders/categories-templates.seeder'

export type SeedEnvironment = 'development' | 'production'

export const seedDatabase = async (
  container: Container,
  environment: SeedEnvironment
) => {
  const db = await container.inject(Database)
  const logger = await container.inject(Logger)

  const currenciesSeeder = await container.inject(CurrenciesSeeder)
  const categoriesTemplatesSeeder = await container.inject(
    CategoriesTemplatesSeeder
  )

  await db.transaction(async (tx) => {
    await currenciesSeeder(tx)
    await categoriesTemplatesSeeder(tx)
  })

  logger.info('Database seeded')
}
