import { DatabaseInstance } from '@database/drizzle'
import { defineProvider, Injector } from '@mikrokit/di'

export const defineSeeder = <T extends object>(
  seeder: (db: DatabaseInstance, injector: Injector) => T | Promise<T>,
  name: string
) =>
  defineProvider(
    async (
      injector: Injector
    ): Promise<(db: DatabaseInstance) => Promise<T>> => {
      return async (db: DatabaseInstance) => {
        return await seeder(db, injector)
      }
    },
    name
  )
