import { defineProvider } from '@mikrokit/di'

import { BadRequestException } from '@api/exceptions/bad-request.exception'

import { UsersService } from './users.service'

import { SendEmailJobData, SendEmailQueue } from 'src/queues/send-email.queue'

import { EmailVerificationsRepository } from '@database/repositories/email-verifications.repository'
import { EmailVerificationTokensRepository } from '@database/repositories/email-verification-tokens.repository'

import { EmailVerificationTokenId, UserId } from '@database/schema'

// 1 hour
const EMAIL_VERIFICATION_VALID_TIMEOUT = 1000 * 60 * 60 * 1

export const EmailVerificationService = defineProvider(async (injector) => {
  const usersService = await injector.inject(UsersService)

  const emailVerificationsRepository = await injector.inject(
    EmailVerificationsRepository
  )
  const emailVerificationTokensRepository = await injector.inject(
    EmailVerificationTokensRepository
  )

  const sendEmailQueue = await injector.inject(SendEmailQueue.queue)

  const initEmailVerification = async (email: string) => {
    const user = await usersService.findUserByEmailOrThrow(email)

    const activeEmailVerificationToken =
      await emailVerificationTokensRepository.findActiveEmailVerificationTokenByUserId(
        user.id
      )

    if (activeEmailVerificationToken) {
      throw new BadRequestException('email_verification_already_requested')
    }

    const emailVerificationToken =
      await emailVerificationTokensRepository.createEmailVerificationToken(
        user.id,
        new Date(Date.now() + EMAIL_VERIFICATION_VALID_TIMEOUT)
      )

    await addSendEmailVerificationJob({
      to: email,
      subject: 'Email verification',
      content: `Your email verification token: ${emailVerificationToken.id}`,
    })
  }

  const verifyEmailByToken = async (token: EmailVerificationTokenId) => {
    const emailVerificationToken =
      await emailVerificationTokensRepository.findActiveEmailVerificationTokenById(
        token
      )

    if (!emailVerificationToken) {
      throw new BadRequestException('invalid_email_verification_token')
    }
    const emailVerificationExists =
      await emailVerificationsRepository.verificationExistsForUserById(
        emailVerificationToken.userId
      )

    if (emailVerificationExists) {
      throw new BadRequestException('email_already_verified')
    }

    await emailVerificationsRepository.createEmailVerificationForUserById(
      emailVerificationToken.userId
    )

    await emailVerificationTokensRepository.expireById(token)
  }

  const addSendEmailVerificationJob = async (jobData: SendEmailJobData) => {
    await sendEmailQueue.add(`send-email-verification:${jobData.to}`, jobData)
  }

  const isUserEmailVerifiedById = async (userId: UserId) => {
    const emailVerificationExists =
      await emailVerificationsRepository.verificationExistsForUserById(userId)

    return emailVerificationExists
  }

  return {
    initEmailVerification,
    verifyEmailByToken,
    isUserEmailVerifiedById,
  }
}, 'EmailVerificationService')
