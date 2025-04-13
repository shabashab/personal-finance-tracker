import { AccountSelect, CurrencySelect } from '@database/schema'

export interface FullAccount extends AccountSelect {
  balance: string
  currency: CurrencySelect
}
