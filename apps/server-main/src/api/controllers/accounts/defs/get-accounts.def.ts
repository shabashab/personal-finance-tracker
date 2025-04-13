import { AccountSelect, CurrencySelect } from '@database/schema'
import { defineDto } from '@dtos/_utils'
import { accountWithCurrencyDto } from '@dtos/account.dto'

export const getAccountsResponseDto = defineDto(
  accountWithCurrencyDto.schema.array(),
  (data: { accounts: AccountSelect; currencies: CurrencySelect }[]) => {
    return data.map((item) =>
      accountWithCurrencyDto(item.accounts, item.currencies)
    )
  }
)
