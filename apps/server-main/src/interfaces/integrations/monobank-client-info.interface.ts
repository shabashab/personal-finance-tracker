import { MonobankAccount } from './monobank-account.interface'

export interface MonobankClientInfo {
  clientId: string
  name: string
  webhookUrl?: string
  accounts: MonobankAccount[]
}
