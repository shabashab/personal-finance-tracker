import { CurrencySelect } from '@database/schema'
import { defineDto } from '@dtos/_utils'
import { currencyDto } from '@dtos/currency.dto'

export const getCurrenciesResponseDto = defineDto(
  currencyDto.schema.array(),
  (currencies: CurrencySelect[]) => {
    return currencies.map((currency) => currencyDto(currency))
  }
)
