import { EmailVerificationTokenId } from '@database/schema'
import { Container } from '@mikrokit/di'
import { EmailVerificationService } from '@services/email-verification.service'

export const verifyEmailByToken = async (
  container: Container,
  token: EmailVerificationTokenId
) => {
  const emailVerificationService = await container.inject(
    EmailVerificationService
  )

  await emailVerificationService.verifyEmailByToken(token)
}
