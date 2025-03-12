import { z } from 'zod'
import { defineDto } from '../_utils'

export const healthResponseDto = defineDto(
  z.object({
    status: z.string(),
  }),
  () => {
    return {
      status: 'healthy',
    }
  }
)
