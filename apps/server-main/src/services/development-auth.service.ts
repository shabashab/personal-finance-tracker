import { defineProvider } from '@mikrokit/di'

import { UsersService } from '@services/users.service'
import { CoreAuthService } from './core-auth.service'

import { NotFoundException } from 'src/api/exceptions/not-found.exception'

import { UserId } from '@database/schema'
import { RegisterUserOptions } from './interfaces/register-user-options.interface'

export const DevelopmentAuthService = defineProvider(async (injector) => {
  const usersService = await injector.inject(UsersService)
  const coreAuthService = await injector.inject(CoreAuthService)

  const loginByIdOrThrow = async (id: UserId) => {
    const user = await usersService.findUserById(id)

    if (!user) {
      throw new NotFoundException('user_not_found')
    }

    return await coreAuthService.authenticateUser(user)
  }

  const registerOrThrow = async (
    email?: string,
    options?: RegisterUserOptions
  ) => {
    const user = await coreAuthService.registerUserOrThrow(email, options)

    return await coreAuthService.authenticateUser(user)
  }

  return {
    loginByIdOrThrow,
    registerOrThrow,
  }
}, 'DevelepmentAuthService')
