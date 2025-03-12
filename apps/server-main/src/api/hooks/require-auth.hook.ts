import { defineProvider } from '@mikrokit/di'
import { onRequestMetaHookHandler } from 'fastify/types/hooks'
import { UnauthorizedException } from '../exceptions/unauthorized.exception'
import { AuthService } from '@services/auth/auth.service'
import { UserRole } from '@database/schema'
import { ForbiddenException } from '../exceptions/forbidden.exception'

type RequireAuthMiddlewareFactory = (
  requiredRoles: UserRole[]
) => onRequestMetaHookHandler

export const RequireAuthHook = defineProvider<RequireAuthMiddlewareFactory>(
  async (injector) => {
    const authService = await injector.inject(AuthService)

    return (roles) => async (request, reply) => {
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

      try {
        const user = await authService.verifyTokenAndGetUserOrThrow(token)
        request.user = user
      } catch (e) {
        throw new UnauthorizedException('invalid_auth_token')
      }

      // Always true, more of a type guard
      if (request.user.roles) {
        const hasEveryRole = roles.every((role) =>
          request.user?.roles.includes(role)
        )

        if (!hasEveryRole) {
          throw new ForbiddenException()
        }
      }
    }
  }
)
