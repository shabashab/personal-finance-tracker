import { Config } from '@config'
import { UsersRepository } from '@database/repositories/users.repository'
import { UserId } from '@database/schema'
import { defineProvider } from '@mikrokit/di'
import * as jwt from 'jsonwebtoken'

interface JwtPayload {
  sub: UserId
}

export const AuthService = defineProvider(async (injector) => {
  const config = await injector.inject(Config)
  const usersRepository = await injector.inject(UsersRepository)

  const createTokenForUserId = (userId: UserId) => {
    const payload: JwtPayload = {
      sub: userId,
    }

    return jwt.sign(payload, config.JWT_SECRET)
  }

  const verifyTokenAndGetUserOrThrow = async (token: string) => {
    const payload = jwt.verify(token, config.JWT_SECRET) as JwtPayload
    const user = await usersRepository.findUserById(payload.sub)

    if (!user) {
      throw new Error('user_not_found')
    }

    return user
  }

  return {
    createTokenForUserId,
    verifyTokenAndGetUserOrThrow,
  }
}, 'AuthService')
