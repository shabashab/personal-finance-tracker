import { CurrencyId, IntegrationData, UserId } from '@database/schema'

export interface AccountCreateData {
  userId: UserId
  name: string
  currencyId: CurrencyId
  integration?: IntegrationData
}
