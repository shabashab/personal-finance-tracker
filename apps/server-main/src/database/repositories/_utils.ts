import { Injector, defineProvider } from '@mikrokit/di'
import { Database } from '../drizzle'
import * as schema from '../schema'
import { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core'

export type Repository<T> = T & {
  withTransaction: (
    transaction: PgDatabase<PgQueryResultHKT, typeof schema>
  ) => Promise<T>
}

export const defineRepository = <T extends object>(
  repository: (
    db: PgDatabase<PgQueryResultHKT, typeof schema>,
    injector: Injector
  ) => T | Promise<T>,
  name: string
) =>
  defineProvider(async (injector: Injector): Promise<Repository<T>> => {
    const db = await injector.inject(Database)

    const withTransaction = async (
      transaction: PgDatabase<PgQueryResultHKT, typeof schema>
    ) => {
      return await repository(transaction, injector)
    }

    const instantiatedRepository = await repository(db, injector)

    Object.assign(instantiatedRepository, { withTransaction })

    return instantiatedRepository as Repository<T>
  }, name)
