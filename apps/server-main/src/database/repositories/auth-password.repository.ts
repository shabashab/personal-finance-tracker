import { defineRepository } from './_utils'
import {
  users,
  UserId,
  authPasswords,
  AuthPasswordId,
  AuthPasswordInsert,
} from '@database/schema'

import { eq } from 'drizzle-orm'

export const AuthPasswordRepository = defineRepository(async (db) => {
  const findByEmail = async (email: string) => {
    const [result] = await db
      .select()
      .from(users)
      .innerJoin(authPasswords, eq(users.id, authPasswords.userId))
      .where(eq(users.email, email))
      .limit(1)

    if (!result) {
      return
    }

    return {
      user: result.users,
      authPassword: result.auth_passwords,
    }
  }

  const createAuthPassword = async (userId: UserId, passwordHash: string) => {
    const authPassword: AuthPasswordInsert = {
      userId,
      passwordHash,
    }

    const [result] = await db
      .insert(authPasswords)
      .values(authPassword)
      .returning()

    if (!result) {
      throw new Error('Failed to create auth password')
    }

    return result
  }

  const updatePasswordHashById = async (
    id: AuthPasswordId,
    passwordHash: string
  ) => {
    const [result] = await db
      .update(authPasswords)
      .set({
        passwordHash,
      })
      .where(eq(authPasswords.id, id))
      .returning()

    if (!result) {
      throw new Error('Failed to update password hash')
    }

    return result
  }

  return {
    findByEmail,
    createAuthPassword,
    updatePasswordHashById,
  }
}, 'AuthPasswordRepository')
