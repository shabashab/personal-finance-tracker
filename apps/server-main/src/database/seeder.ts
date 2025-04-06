/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Container } from '@mikrokit/di'
import { Database } from './drizzle'
import { Logger } from '@core/logger'

export type SeedEnvironment = 'development' | 'production'

export const seedDatabase = async (
  container: Container,
  environment: SeedEnvironment
) => {
  const db = await container.inject(Database)
  const logger = await container.inject(Logger)

  await db.transaction(async (tx) => {})

  logger.info('Database seeded')
}
