import { defineRepository } from './_utils'
import {
  EmailVerificationTokenId,
  emailVerificationTokens,
  UserId,
} from '@database/schema'

import { and, eq, gt } from 'drizzle-orm'

export const EmailVerificationTokensRepository = defineRepository(
  async (db) => {
    const createEmailVerificationToken = async (
      userId: UserId,
      expiresAt: Date
    ) => {
      const [result] = await db
        .insert(emailVerificationTokens)
        .values({
          userId,
          expiresAt,
        })
        .returning()

      if (!result) {
        throw new Error('Failed to create email verification token')
      }

      return result
    }

    const findActiveEmailVerificationTokenById = async (
      id: EmailVerificationTokenId
    ) => {
      const [result] = await db
        .select()
        .from(emailVerificationTokens)
        .where(
          and(
            eq(emailVerificationTokens.id, id),
            gt(emailVerificationTokens.expiresAt, new Date())
          )
        )
        .orderBy(emailVerificationTokens.createdAt)
        .limit(1)

      if (!result) {
        return
      }

      return result
    }

    const expireById = async (id: EmailVerificationTokenId) => {
      await db
        .update(emailVerificationTokens)
        .set({
          expiresAt: new Date(),
        })
        .where(eq(emailVerificationTokens.id, id))
        .returning()
    }

    const findActiveEmailVerificationTokenByUserId = async (userId: UserId) => {
      const [result] = await db
        .select()
        .from(emailVerificationTokens)
        .where(
          and(
            eq(emailVerificationTokens.userId, userId),
            gt(emailVerificationTokens.expiresAt, new Date())
          )
        )
        .orderBy(emailVerificationTokens.createdAt)
        .limit(1)

      return result
    }

    return {
      createEmailVerificationToken,
      findActiveEmailVerificationTokenById,
      findActiveEmailVerificationTokenByUserId,
      expireById,
    }
  },
  'EmailVerificationTokensRepository'
)
