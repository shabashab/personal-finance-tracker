/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injector, defineProvider } from '@mikrokit/di'
import { Database, DatabaseInstance } from '../drizzle'

export type Repository<T> = T & {
  withTransaction: (transaction: DatabaseInstance) => Promise<T>
}

export const defineRepository = <T extends object>(
  repository: (db: DatabaseInstance, injector: Injector) => T | Promise<T>,
  name: string
) =>
  defineProvider(async (injector: Injector): Promise<Repository<T>> => {
    const db = await injector.inject(Database)

    const withTransaction = async (transaction: DatabaseInstance) => {
      return await repository(transaction, injector)
    }

    const instantiatedRepository = await repository(db, injector)

    Object.assign(instantiatedRepository, { withTransaction })

    return instantiatedRepository as Repository<T>
  }, name)

export const isSerializationError = (error: any) => {
  return (
    'code' in error &&
    // Serialization error code
    error.code === '40001'
  )
}
