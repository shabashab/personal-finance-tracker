import { z } from 'zod'
import { defineDto } from '../_utils'
import { UserSelect } from '@database/schema'

export const userResponseDto = defineDto(
  z.object({
    id: z.string().uuid(),
  }),
  (user: UserSelect) => {
    return {
      id: user.id,
    }
  }
)
