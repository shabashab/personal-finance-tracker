/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineProvider } from '@mikrokit/di'
import { onRequestMetaHookHandler } from 'fastify/types/hooks'
import { UnauthorizedException } from '../exceptions/unauthorized.exception'

import { CoreAuthService } from '@services/core-auth.service'
import { SessionId } from '@database/schema'
import { asUuid } from '@utils'

type RequireAuthMiddlewareFactory = () => onRequestMetaHookHandler

export const RequireAuthHook = defineProvider<RequireAuthMiddlewareFactory>(
  async (injector) => {
    const coreAuthService = await injector.inject(CoreAuthService)

    return () => async (request, reply) => {
      const authHeader = request.headers.authorization

      if (!authHeader) {
        throw new UnauthorizedException('no_auth_header_provided')
      }

      const authHeaderParts = authHeader.split(' ')

      if (authHeaderParts.length !== 2) {
        throw new UnauthorizedException('invalid_auth_header')
      }

      if (authHeaderParts[0] !== 'Bearer') {
        throw new UnauthorizedException('invalid_auth_scheme')
      }

      const token = authHeaderParts[1]

      if (!token) {
        throw new UnauthorizedException('no_token_provided')
      }

      const authenticatedUser =
        await coreAuthService.verifyTokenAndGetUserOrThrow(
          asUuid<SessionId>(token)
        )

      request.user = authenticatedUser
    }
  }
)
