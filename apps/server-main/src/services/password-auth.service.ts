import { defineProvider } from '@mikrokit/di'

import { CoreAuthService } from './core-auth.service'

import * as bcrypt from 'bcrypt'

import { UnauthorizedException } from 'src/api/exceptions/unauthorized.exception'

import { AuthPasswordRepository } from '@database/repositories/auth-password.repository'

export const PasswordAuthService = defineProvider(async (injector) => {
  const coreAuthService = await injector.inject(CoreAuthService)
  const authPasswordRepository = await injector.inject(AuthPasswordRepository)

  const loginOrThrow = async (email: string, password: string) => {
    const authPasswordWithUser = await authPasswordRepository.findByEmail(email)

    if (!authPasswordWithUser) {
      throw new UnauthorizedException('invalid_credentials')
    }

    const hashValid = validateHash(
      password,
      authPasswordWithUser.authPassword.passwordHash
    )

    if (!hashValid) {
      throw new UnauthorizedException('invalid_credentials')
    }

    return await coreAuthService.authenticateUser(authPasswordWithUser.user)
  }

  const registerOrThrow = async (email: string, password: string) => {
    const user = await coreAuthService.registerUserOrThrow(email, {
      verifyEmail: true,
    })

    const passwordHash = generateHash(password)

    await authPasswordRepository.createAuthPassword(user.id, passwordHash)
  }

  const generateHash = (password: string) => {
    return bcrypt.hashSync(password, 10)
  }

  const validateHash = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash)
  }

  return {
    loginOrThrow,
    registerOrThrow,
  }
}, 'PasswordAuthService')
