import { healthResponseDto } from './dtos/health/health.response-dto'
import { defineController } from './_utils'

export const HealthController = defineController('/health', async (r) => {
  r.public.get(
    '/',
    {
      response: healthResponseDto.schema,
      docs: {
        summary: 'Health check',
        tags: ['health'],
      },
    },
    async () => {
      return healthResponseDto()
    }
  )
})
