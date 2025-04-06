import * as schema from './schema'

import { PgDatabase } from 'drizzle-orm/pg-core'
import { PgliteQueryResultHKT } from 'drizzle-orm/pglite'
import { drizzle, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'

import { Config } from '../config'
import { defineProvider } from '@mikrokit/di'

export type DatabaseInstance = PgDatabase<
  NodePgQueryResultHKT | PgliteQueryResultHKT,
  typeof schema
>

export const Database = defineProvider<DatabaseInstance>(async (injector) => {
  const config = await injector.inject(Config)

  return drizzle(config.DATABASE_URL, {
    schema,
    casing: 'snake_case',
    logger: true,
  })
})
