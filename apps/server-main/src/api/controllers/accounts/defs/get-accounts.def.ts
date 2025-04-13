import { defineDto } from '@dtos/_utils'
import { fullAccountDto } from '@dtos/account.dto'
import { FullAccount } from '@interfaces/accounts/full-account.interface'

export const getAccountsResponseDto = defineDto(
  fullAccountDto.schema.array(),
  (data: FullAccount[]) => {
    return data.map((item) => fullAccountDto(item))
  }
)
