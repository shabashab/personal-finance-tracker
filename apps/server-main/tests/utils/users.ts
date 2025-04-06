import { Database } from '@database/drizzle'
import { emailVerificationTokens, users } from '@database/schema'
import { Container } from '@mikrokit/di'
import { EmailVerificationService } from '@services/email-verification.service'
import { PasswordAuthService } from '@services/password-auth.service'
import { eq } from 'drizzle-orm'

export const registerUserByEmailAndPassword = async (
  container: Container,
  email: string,
  password: string
) => {
  const passwordAuthService = await container.inject(PasswordAuthService)
  const db = await container.inject(Database)

  await passwordAuthService.registerOrThrow(email, password)

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!user) {
    throw new Error('Error getting user')
  }

  return user
}

export const registerUserAndVerifyEmail = async (
  container: Container,
  email: string,
  password: string
) => {
  const emailVerificationService = await container.inject(
    EmailVerificationService
  )

  const user = await registerUserByEmailAndPassword(container, email, password)
  const db = await container.inject(Database)

  const emailVerificationToken =
    await db.query.emailVerificationTokens.findFirst({
      where: eq(emailVerificationTokens.userId, user.id),
      orderBy(fields, operators) {
        return operators.desc(fields.createdAt)
      },
    })

  if (!emailVerificationToken) {
    throw new Error('Error getting email verification token')
  }

  await emailVerificationService.verifyEmailByToken(emailVerificationToken.id)

  return user
}
