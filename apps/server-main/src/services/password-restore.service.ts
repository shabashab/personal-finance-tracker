import { defineProvider } from '@mikrokit/di'
import { BadRequestException } from '@api/exceptions/bad-request.exception'

import { AuthPasswordRepository } from '@database/repositories/auth-password.repository'
import { PasswordRestoresRepository } from '@database/repositories/password-restore.repository'

import { PasswordRestoreId } from '@database/schema'

import * as bcrypt from 'bcrypt'

import { SendEmailQueue, SendEmailJobData } from 'src/queues/send-email.queue'

// 12 hours
const PASSWORD_RESTORE_VALID_TIMEOUT = 1000 * 60 * 60 * 12

const MAX_RESTORE_REQUESTS_PER_DAY = 5

export const PasswordRestoreService = defineProvider(async (injector) => {
  const authPasswordRepository = await injector.inject(AuthPasswordRepository)
  const passwordRestoresRepository = await injector.inject(
    PasswordRestoresRepository
  )

  const sendEMailQueue = await injector.inject(SendEmailQueue.queue)

  const initPasswordRestoreByEmail = async (email: string) => {
    const authPasswordWithUser = await authPasswordRepository.findByEmail(email)

    if (!authPasswordWithUser?.user) {
      throw new BadRequestException('invalid_email')
    }

    if (!authPasswordWithUser.user.email) {
      throw new BadRequestException('user_has_no_email')
    }

    const { user } = authPasswordWithUser

    const restoreRequestsInLastDay =
      await passwordRestoresRepository.countRestoresInLastDayByUserId(user.id)

    if (restoreRequestsInLastDay >= MAX_RESTORE_REQUESTS_PER_DAY) {
      throw new BadRequestException('too_many_requests')
    }

    const passwordRestoreExpiration = new Date(
      Date.now() + PASSWORD_RESTORE_VALID_TIMEOUT
    )

    const passwordRestore =
      await passwordRestoresRepository.createPasswordRestore(
        authPasswordWithUser.authPassword.id,
        passwordRestoreExpiration
      )

    await addSendMailPasswordRestoreJob({
      to: authPasswordWithUser.user.email,
      subject: 'Restore your password',
      content: `Your restore token: ${passwordRestore.id}`,
    })
  }

  const restorePasswordByToken = async (
    token: PasswordRestoreId,
    newPassword: string
  ) => {
    const passwordRestoreWithUserAndAuthPassword =
      await passwordRestoresRepository.findActiveById(token)

    if (!passwordRestoreWithUserAndAuthPassword) {
      throw new BadRequestException('invalid_token')
    }

    if (!passwordRestoreWithUserAndAuthPassword.user.email) {
      throw new BadRequestException('user_has_no_email')
    }

    const { user, passwordRestore } = passwordRestoreWithUserAndAuthPassword

    const hasNewerRestoreRequest =
      await passwordRestoresRepository.existsNewerActiveTokenByUserIdAndTokenId(
        user.id,
        passwordRestore.id
      )

    if (hasNewerRestoreRequest) {
      throw new BadRequestException('newer_request_exists')
    }

    const samePassword = validateHash(
      newPassword,
      passwordRestoreWithUserAndAuthPassword.authPassword.passwordHash
    )

    if (samePassword) {
      throw new BadRequestException('same_password')
    }
    const newPasswordHash = generateHash(newPassword)

    await authPasswordRepository.updatePasswordHashById(
      passwordRestoreWithUserAndAuthPassword.authPassword.id,
      newPasswordHash
    )

    await passwordRestoresRepository.expireAllByPasswordId(
      passwordRestore.authPasswordId
    )
  }

  const generateHash = (password: string) => bcrypt.hashSync(password, 10)

  const validateHash = (password: string, hash: string) =>
    bcrypt.compareSync(password, hash)

  const addSendMailPasswordRestoreJob = async (jobData: SendEmailJobData) => {
    await sendEMailQueue.add(
      `send-email-password-restore:${jobData.to}`,
      jobData
    )
  }

  return {
    initPasswordRestoreByEmail,
    restorePasswordByToken,
  }
}, 'PasswordRestoreService')
