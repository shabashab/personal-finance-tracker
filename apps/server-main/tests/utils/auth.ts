import { UserId } from '@database/schema'
import { Container } from '@mikrokit/di'
import { CoreAuthService } from '@services/core-auth.service'
import { UsersService } from '@services/users.service'

export const createUserAuthSession = async (
  container: Container,
  userId: UserId
) => {
  const usersService = await container.inject(UsersService)
  const coreAuthService = await container.inject(CoreAuthService)

  const user = await usersService.findUserById(userId)

  if (!user) {
    throw new Error('User not found')
  }

  const session = await coreAuthService.authenticateUser(user)

  return session
}
