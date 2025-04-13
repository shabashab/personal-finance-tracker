import { UsersRepository } from '@database/repositories/users.repository'

import { defineProvider } from '@mikrokit/di'

import { NotFoundException } from 'src/api/exceptions/not-found.exception'
import { UsersSetupService } from './users-setup.service'

export const UsersService = defineProvider(async (injector) => {
  const usersRepository = await injector.inject(UsersRepository)
  const userSetupService = await injector.inject(UsersSetupService)

  const findUserByEmail = async (email: string) => {
    const user = await usersRepository.findUserByEmail(email)

    if (!user) {
      throw new NotFoundException('user_not_found')
    }

    return user
  }

  const createUser = async (email?: string) => {
    const createdUser = await usersRepository.createUser(email)

    await userSetupService.setupUserById(createdUser.id)

    return createdUser
  }

  return {
    findUserById: usersRepository.findUserById,
    findUserByEmailOrThrow: findUserByEmail,
    userExistsByEmail: usersRepository.userExistsByEmail,
    updateUserRolesById: usersRepository.updateUserRolesById,
    createUser,
  }
}, 'UsersService')
