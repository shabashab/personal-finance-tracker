import { z } from 'zod'

import { defineDto } from '@dtos/_utils'
import { iamDto } from './get-iam.def'

import { SessionId, UserSelect } from '@database/schema'

export const successfulLoginDto = defineDto(
  z.object({
    user: iamDto.schema,
    token: z.string(),
  }),
  (user: UserSelect, token: SessionId) => {
    return {
      user: iamDto(user),
      token,
    }
  }
)
