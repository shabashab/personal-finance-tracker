import { defineProvider } from '@mikrokit/di'

import { SessionId, UserRole, UserSelect } from '@database/schema'

import { SessionsRepository } from '@database/repositories/sessions.repository'

import { BadRequestException } from 'src/api/exceptions/bad-request.exception'
import { RegisterUserOptions } from './interfaces/register-user-options.interface'
import { EmailVerificationService } from './email-verification.service'
import { ConflictException } from '@api/exceptions/conflict.exception'
import { Config } from '@config'
import { UnauthorizedException } from '@api/exceptions/unauthorized.exception'
import { UsersService } from './users.service'

const MILLIS_IN_HOUR = 60 * 60 * 1000

export const CoreAuthService = defineProvider(async (injector) => {
  const sessionsRepository = await injector.inject(SessionsRepository)
  const usersService = await injector.inject(UsersService)

  const emailVerificationService = await injector.inject(
    EmailVerificationService
  )

  const config = await injector.inject(Config)

  const verifyTokenAndGetUserOrThrow = async (token: SessionId) => {
    const userWithActiveSession =
      await sessionsRepository.findUserAndSessionByActiveSessionId(token)

    if (!userWithActiveSession) {
      throw new BadRequestException('expired_or_invalid_token')
    }

    const { user, session } = userWithActiveSession

    if (session.expiresAt) {
      const shouldExtendSession =
        session.expiresAt.getTime() - Date.now() <= MILLIS_IN_HOUR * 12

      if (shouldExtendSession) {
        await sessionsRepository.extendSessionByOneDayById(session.id)
      }
    }

    return user
  }

  const authenticateUser = async (user: UserSelect) => {
    if (!config.AUTH_ALLOW_UNVERIFIED_EMAIL_LOGIN) {
      const isEmailVerified =
        await emailVerificationService.isUserEmailVerifiedById(user.id)

      if (!isEmailVerified) {
        throw new UnauthorizedException('email_not_verified')
      }
    }

    const userSession = await sessionsRepository.createSessionForUserById(
      user.id
    )

    return {
      user,
      token: userSession.id,
    }
  }

  const registerUserOrThrow = async (
    email?: string,
    options?: RegisterUserOptions
  ) => {
    if (options?.verifyEmail && !email) {
      throw new BadRequestException('email_required_for_email_verification')
    }

    if (email) {
      const userExists = await usersService.userExistsByEmail(email)

      if (userExists) {
        throw new BadRequestException('user_already_exists')
      }
    }

    let user = await usersService.createUser(email)

    if (options?.verifyEmail && email) {
      await emailVerificationService.initEmailVerification(email)
    }

    if (options?.isAdmin) {
      user = await promoteUserToAdmin(user)
    }

    await sessionsRepository.createSessionForUserById(user.id)

    return user
  }

  const promoteUserToAdmin = async (user: UserSelect) => {
    if (user.roles.includes('ADMIN')) {
      throw new ConflictException('user_is_already_admin')
    }

    const newUserRoles: UserRole[] = [...user.roles, 'ADMIN']

    return await usersService.updateUserRolesById(user.id, newUserRoles)
  }

  return {
    verifyTokenAndGetUserOrThrow,
    authenticateUser,
    registerUserOrThrow,
  }
}, 'CoreAuthService')
