import { EmailVerificationService } from '@services/email-verification.service'
import { successfulOperationDto } from '../../../dtos/successful-operation.dto'
import { defineController } from '../_utils'
import { verifyEmailRequestSchema } from './defs/verify-email.def'
import { asUuid } from '@utils'
import { EmailVerificationTokenId } from '@database/schema'

export const EmailVerificationController = defineController(
  '/auth/email-verification',
  async (r, injector) => {
    const emailVerificationService = await injector.inject(
      EmailVerificationService
    )

    r.public.post(
      '/verify-email',
      {
        docs: {
          tags: ['auth/email-verification'],
          summary: 'Verify email by token',
        },
        response: successfulOperationDto.schema,
        request: {
          query: verifyEmailRequestSchema,
        },
      },
      async ({ query }) => {
        await emailVerificationService.verifyEmailByToken(
          asUuid<EmailVerificationTokenId>(query.token)
        )

        return successfulOperationDto()
      }
    )
  }
)
