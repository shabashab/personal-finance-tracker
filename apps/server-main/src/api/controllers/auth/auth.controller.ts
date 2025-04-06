import { defineController } from '../_utils'

import { DevelopmentAuthService } from '@services/development-auth.service'
import { PasswordAuthService } from '@services/password-auth.service'

import { iamDto } from './defs/get-iam.def'
import { successfulLoginDto } from './defs/successful-login.def'
import { successfulOperationDto } from '@dtos/successful-operation.dto'

import { developmentLoginRequestSchema } from './defs/development-login.def'
import { developmentRegisterRequestSchema } from './defs/development-register.def'
import { passwordLoginRequestSchema } from './defs/password-login.def'
import { passwordRegisterRequestSchema } from './defs/password-register.def'

import { asUuid } from '@utils'
import { UserId } from '@database/schema'

export const AuthController = defineController('/auth', async (r, injector) => {
  const developmentAuthService = await injector.inject(DevelopmentAuthService)
  const passwordAuthService = await injector.inject(PasswordAuthService)

  r.auth.get(
    '/iam',
    {
      docs: {
        tags: ['auth'],
        summary: 'Get current user',
      },
      response: iamDto.schema,
    },
    async (request) => {
      return iamDto(request.user)
    }
  )

  r.public.post(
    '/login/dev',
    {
      docs: {
        tags: ['auth/dev'],
        summary: 'Login via user id',
      },
      response: successfulLoginDto.schema,
      request: {
        body: developmentLoginRequestSchema,
      },
    },
    async ({ body }) => {
      const result = await developmentAuthService.loginByIdOrThrow(
        asUuid<UserId>(body.id)
      )

      return successfulLoginDto(result.user, result.token)
    }
  )

  r.public.post(
    '/register/dev',
    {
      docs: {
        tags: ['auth/dev'],
        summary: 'Register via email',
      },
      response: successfulLoginDto.schema,
      request: {
        body: developmentRegisterRequestSchema,
      },
    },
    async ({ body }) => {
      const result = await developmentAuthService.registerOrThrow(
        body.email,
        body.options
      )

      return successfulLoginDto(result.user, result.token)
    }
  )

  r.public.post(
    '/login/password',
    {
      docs: {
        tags: ['auth/password'],
        summary: 'Login via email and password',
      },
      response: successfulLoginDto.schema,
      request: {
        body: passwordLoginRequestSchema,
      },
    },
    async ({ body }) => {
      const result = await passwordAuthService.loginOrThrow(
        body.email,
        body.password
      )

      return successfulLoginDto(result.user, result.token)
    }
  )

  r.public.post(
    '/register/password',
    {
      docs: {
        tags: ['auth/password'],
        summary: 'Register via password and email',
      },
      response: successfulOperationDto.schema,
      request: {
        body: passwordRegisterRequestSchema,
      },
    },
    async ({ body }) => {
      await passwordAuthService.registerOrThrow(body.email, body.password)

      return successfulOperationDto()
    }
  )
})
