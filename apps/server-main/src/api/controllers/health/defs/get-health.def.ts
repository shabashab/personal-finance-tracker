import { z } from 'zod'

import { defineDto } from '@dtos/_utils'

export const healthDto = defineDto(
  z.object({
    status: z.string(),
  }),
  () => {
    return {
      status: 'healthy',
    }
  }
)
