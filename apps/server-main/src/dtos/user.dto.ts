import { z } from 'zod'
import { UserSelect, userRole } from '@database/schema'
import { defineDto } from './_utils'

export const userDto = defineDto(
  z.object({
    id: z.string().uuid(),
    roles: z.array(z.enum(userRole.enumValues)).openapi({
      examples: [userRole.enumValues],
    }),
    email: z.string().email().optional().openapi({
      example: 'test@example.com',
    }),
  }),
  (user: UserSelect) => {
    return {
      id: user.id,
      roles: user.roles,
      email: user.email ?? undefined,
    }
  }
)
