import { UsersRepository } from '@database/repositories/users.repository'

import { defineProvider } from '@mikrokit/di'

import { NotFoundException } from 'src/api/exceptions/not-found.exception'

export const UsersService = defineProvider(async (injector) => {
  const usersRepository = await injector.inject(UsersRepository)

  const findUserByEmail = async (email: string) => {
    const user = await usersRepository.findUserByEmail(email)

    if (!user) {
      throw new NotFoundException('user_not_found')
    }

    return user
  }

  return {
    findUserById: usersRepository.findUserById,
    findUserByEmailOrThrow: findUserByEmail,
  }
}, 'UsersService')
