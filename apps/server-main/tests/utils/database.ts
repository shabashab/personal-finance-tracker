import { Database, DatabaseInstance } from '@database/drizzle'
import { createModule, defineProvider } from '@mikrokit/di'
import { drizzle } from 'drizzle-orm/pglite'
import { repositoriesModule } from 'src/database/repositories'
import { PGlite } from '@electric-sql/pglite'
import * as schema from '../../src/database/schema/index'

import { createRequire } from 'node:module'
import { seedersModule } from '@database/seeders'
// @ts-expect-error - This is a dynamic import
const require = createRequire(import.meta.url)
const { generateDrizzleJson, generateMigration } =
  require('drizzle-kit/api') as typeof import('drizzle-kit/api')

export let TOKEN: string

const testDatabaseFactory = defineProvider<DatabaseInstance>(
  async (injector) => {
    const client = new PGlite()

    const db = drizzle(client, {
      casing: 'snake_case',
      schema,
    })

    const previousJson = generateDrizzleJson({})
    const currentJson = generateDrizzleJson(
      schema,
      previousJson.id,
      undefined,
      'snake_case'
    )

    const statements = await generateMigration(previousJson, currentJson)

    for (const statement of statements) {
      await db.execute(statement)
    }

    const [user] = await db
      .insert(schema.users)
      .values({
        email: 'test_user@tests.com',
        roles: ['USER'],
      })
      .returning()

    const [session] = await db
      .insert(schema.sessions)
      .values({
        userId: user.id,
      })
      .returning()

    TOKEN = session.id

    return db
  }
)

export const testDatabaseModule = createModule()
  .import(repositoriesModule)
  .import(seedersModule)
  .provide(Database, testDatabaseFactory)
