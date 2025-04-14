import { CurrencyId, IntegrationData, UserId } from '@database/schema'

export interface AccountCreateData {
  userId: UserId
  name: string
  initialBalance?: number
  currencyId: CurrencyId
  integration?: IntegrationData
}
