import { emailVerifications, UserId } from '@database/schema'
import { defineRepository } from './_utils'
import { eq } from 'drizzle-orm'

export const EmailVerificationsRepository = defineRepository(async (db) => {
  const verificationExistsForUserById = async (userId: UserId) => {
    const verification = await db.query.emailVerifications.findFirst({
      where: eq(emailVerifications.userId, userId),
    })

    return !!verification
  }

  const createEmailVerificationForUserById = async (userId: UserId) => {
    const [result] = await db
      .insert(emailVerifications)
      .values({
        userId,
      })
      .returning()

    if (!result) {
      throw new Error('Failed to create email verification')
    }

    return result
  }

  return {
    verificationExistsForUserById,
    createEmailVerificationForUserById,
  }
}, 'EmailVerificationsRepository')
