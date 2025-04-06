import { defineRepository } from './_utils'
import { eq } from 'drizzle-orm'
import { UserId, UserInsert, UserRole, users } from '../schema'

export const UsersRepository = defineRepository(async (db) => {
  const findUserById = async (id: UserId) => {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    })
  }

  const userExistsById = async (id: UserId) => {
    const result = await db.query.users.findFirst({
      columns: {
        id: true,
      },
      where: eq(users.id, id),
    })

    return !!result
  }

  const userExistsByEmail = async (email: string) => {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    return !!user
  }

  const createUser = async (email?: string) => {
    const user: UserInsert = {
      email,
    }

    const [result] = await db.insert(users).values(user).returning()

    if (!result) {
      throw new Error('Failed to create user')
    }

    return result
  }

  const findUserByEmail = async (email: string) => {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    })
  }

  const updateUserRolesById = async (userId: UserId, newRoles: UserRole[]) => {
    const [result] = await db
      .update(users)
      .set({
        roles: newRoles,
      })
      .where(eq(users.id, userId))
      .returning()

    if (!result) {
      throw new Error('Failed to update user roles')
    }

    return result
  }

  return {
    findUserById,
    userExistsById,
    userExistsByEmail,
    createUser,
    findUserByEmail,
    updateUserRolesById,
  }
}, 'UsersRepository')
