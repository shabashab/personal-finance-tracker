import { defineDto } from '@dtos/_utils'
import { fullAccountDto } from '@dtos/account.dto'
import { FullAccount } from '@interfaces/accounts/full-account.interface'
import { z } from 'zod'

export const getAccountsRequestQuerySchema = z.object({
  currencyId: z.string().uuid(),
})

export const getAccountsResponseDto = defineDto(
  fullAccountDto.schema.array(),
  (data: FullAccount[]) => {
    return data.map((item) => fullAccountDto(item))
  }
)
