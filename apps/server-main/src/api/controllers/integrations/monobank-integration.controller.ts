import { z } from 'zod'
import { defineController } from '../_utils'
import {
  monobankPrefetchTokenInfoRequestParamsSchema,
  monobankPrefetchTokenInfoResponseDto,
} from './defs/monobank-prefetch-token-info.def'
import { MonobankIntegrationService } from '@services/monobank-integration.service'
import { successfulOperationDto } from '@dtos/successful-operation.dto'

export const MonobankIntegrationController = defineController(
  '/integrations/monobank',
  async (r, injector) => {
    const monobankIntegrationService = await injector.inject(
      MonobankIntegrationService
    )

    r.auth.get(
      '/prefetch-token-info/:token',
      {
        docs: {
          tags: ['integrations/monobank'],
          description:
            'Get information by token. This endpoint is highly cached, requests to monobank API are only set once per minute',
        },
        request: {
          params: monobankPrefetchTokenInfoRequestParamsSchema,
        },
        response: monobankPrefetchTokenInfoResponseDto.schema,
      },
      async ({ params }) => {
        const clientInfo =
          await monobankIntegrationService.fetchClientInfoByTokenCached(
            params.token
          )

        return monobankPrefetchTokenInfoResponseDto(clientInfo)
      }
    )

    r.public.get(
      '/handle-webhook',
      {
        docs: {
          tags: ['integrations/monobank'],
          description: 'Finish webhook setup configuration',
        },
        response: successfulOperationDto.schema,
      },
      async () => {
        return successfulOperationDto()
      }
    )

    r.public.post(
      '/handle-webhook',
      {
        docs: {
          tags: ['integrations/monobank'],
          description: 'Handle monobank webhook',
        },
        request: {
          body: z.object({}).passthrough(),
        },
        response: z.any(),
      },
      async ({ body }) => {
        await monobankIntegrationService.handleMonobankWebhookReceive(body)

        return {}
      }
    )
  }
)
