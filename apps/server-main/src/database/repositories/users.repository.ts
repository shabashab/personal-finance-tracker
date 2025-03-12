import { defineRepository } from './_utils'
import { eq } from 'drizzle-orm'
import { UserId, users } from '../schema'

export const UsersRepository = defineRepository(async (db) => {
  const findUserById = async (id: UserId) => {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    })
  }

  return {
    findUserById,
  }
}, 'UsersRepository')
