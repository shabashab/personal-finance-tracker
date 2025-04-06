import { PasswordRestoreService } from '@services/password-restore.service'
import { defineController } from '../_utils'
import { initPasswordRestoreRequestSchema } from './defs/init-password-restore.def'
import { successfulOperationDto } from '../../../dtos/successful-operation.dto'
import { restorePasswordRequestSchema } from './defs/restore-password.def'
import { asUuid } from '@utils'
import { PasswordRestoreId } from '@database/schema'

export const PasswordRestoreController = defineController(
  '/auth/password-restore',
  async (r, injector) => {
    const passwordRestoreService = await injector.inject(PasswordRestoreService)

    r.public.post(
      '/init',
      {
        docs: {
          tags: ['auth/password-restore'],
          summary: 'Init password restore',
        },
        response: successfulOperationDto.schema,
        request: {
          body: initPasswordRestoreRequestSchema,
        },
      },
      async ({ body }) => {
        await passwordRestoreService.initPasswordRestoreByEmail(body.email)

        return successfulOperationDto()
      }
    )

    r.public.post(
      '/restore',
      {
        docs: {
          tags: ['auth/password-restore'],
          summary: 'Restore password',
        },
        response: successfulOperationDto.schema,
        request: {
          body: restorePasswordRequestSchema,
        },
      },
      async ({ body }) => {
        await passwordRestoreService.restorePasswordByToken(
          asUuid<PasswordRestoreId>(body.token),
          body.newPassword
        )

        return successfulOperationDto()
      }
    )
  }
)
