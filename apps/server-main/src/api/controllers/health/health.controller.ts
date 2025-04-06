import { healthDto } from './defs/get-health.def'
import { defineController } from '../_utils'

export const HealthController = defineController('/health', async (r) => {
  r.public.get(
    '/',
    {
      response: healthDto.schema,
      docs: {
        summary: 'Health check',
        tags: ['health'],
      },
    },
    async () => {
      return healthDto()
    }
  )
})
