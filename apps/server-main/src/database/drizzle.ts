import { drizzle } from 'drizzle-orm/node-postgres'

import { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core'
import { defineProvider } from '@mikrokit/di'
import { Config } from '../config'
import * as schema from './schema'

export type DatabaseInstance = PgDatabase<PgQueryResultHKT, typeof schema>

export const Database = defineProvider<DatabaseInstance>(async (injector) => {
  const config = await injector.inject(Config)

  return drizzle(config.DATABASE_URL, { schema, casing: 'snake_case' })
})
