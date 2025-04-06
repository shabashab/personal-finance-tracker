import {
  users,
  UserId,
  authPasswords,
  AuthPasswordId,
  passwordRestores,
  PasswordRestoreId,
} from '@database/schema'
import { defineRepository } from './_utils'

import { and, eq, gt, sql } from 'drizzle-orm'

export const PasswordRestoresRepository = defineRepository(async (db) => {
  const createPasswordRestore = async (
    authPasswordId: AuthPasswordId,
    expiresAt: Date
  ) => {
    const [result] = await db
      .insert(passwordRestores)
      .values({
        authPasswordId,
        expiresAt,
      })
      .returning()

    if (!result) {
      throw new Error('Failed to create password restore')
    }

    return result
  }

  const findActiveById = async (id: PasswordRestoreId) => {
    const [result] = await db
      .select()
      .from(passwordRestores)
      .where(
        and(
          eq(passwordRestores.id, id),
          gt(passwordRestores.expiresAt, new Date())
        )
      )
      .innerJoin(
        authPasswords,
        eq(passwordRestores.authPasswordId, authPasswords.id)
      )
      .innerJoin(users, eq(authPasswords.userId, users.id))
      .orderBy(passwordRestores.createdAt)
      .limit(1)

    if (!result) {
      return
    }

    return {
      user: result.users,
      authPassword: result.auth_passwords,
      passwordRestore: result.password_restores,
    }
  }

  const expireAllByPasswordId = async (authPasswordId: AuthPasswordId) => {
    await db
      .update(passwordRestores)
      .set({
        expiresAt: new Date(),
      })
      .where(eq(passwordRestores.authPasswordId, authPasswordId))
  }

  const userHasActiveRestorePasswordTokenById = async (
    userId: UserId
  ): Promise<boolean> => {
    const result = await db.query.passwordRestores.findFirst({
      columns: {
        id: true,
      },
      where: and(
        eq(users.id, userId),
        gt(passwordRestores.expiresAt, new Date())
      ),
    })

    return !!result
  }

  const countRestoresInLastDayByUserId = async (userId: UserId) => {
    const [result] = await db
      .select({
        count: sql<number>`COUNT(password_restores.id)`,
      })
      .from(passwordRestores)
      .innerJoin(
        authPasswords,
        eq(passwordRestores.authPasswordId, authPasswords.id)
      )
      .innerJoin(users, eq(authPasswords.userId, users.id))
      .where(
        and(
          eq(users.id, userId),
          gt(passwordRestores.createdAt, sql`now() - interval '1 day'`)
        )
      )

    if (!result) {
      return 0
    }

    return result.count
  }

  const existsNewerActiveToken = async (
    userId: UserId,
    token: PasswordRestoreId
  ) => {
    const [result] = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(passwordRestores)
      .innerJoin(
        authPasswords,
        eq(passwordRestores.authPasswordId, authPasswords.id)
      )
      .innerJoin(users, eq(authPasswords.userId, users.id))
      .where(
        and(
          eq(users.id, userId),
          gt(passwordRestores.expiresAt, new Date()),
          gt(
            passwordRestores.createdAt,
            db
              .select({ createdAt: passwordRestores.createdAt })
              .from(passwordRestores)
              .where(eq(passwordRestores.id, token))
          )
        )
      )

    if (!result) {
      return false
    }

    return result.count > 0
  }

  return {
    createPasswordRestore,
    findActiveById,
    userHasActiveRestorePasswordTokenById,
    countRestoresInLastDayByUserId,
    existsNewerActiveTokenByUserIdAndTokenId: existsNewerActiveToken,
    expireAllByPasswordId,
  }
}, 'PasswordRestoresRepository')
