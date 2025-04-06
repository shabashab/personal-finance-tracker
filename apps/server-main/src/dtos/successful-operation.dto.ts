import { z } from 'zod'

import { defineDto } from '@dtos/_utils'

export const successfulOperationDto = defineDto(
  z.object({
    status: z.string().openapi({
      example: 'successful',
    }),
  }),
  () => {
    return {
      status: 'successful',
    }
  }
)
