import { defineController } from './_utils'
import { iamResponseDto } from './dtos/auth/iam.response-dto'

export const AuthController = defineController('/auth', async (r, injector) => {
  r.auth.get(
    '/iam',
    {
      docs: {
        tags: ['auth'],
        summary: 'Get current authenticated api key',
      },
      response: iamResponseDto.schema,
    },
    async (req) => {
      return iamResponseDto(req.user)
    }
  )
})
