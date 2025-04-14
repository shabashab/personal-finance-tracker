import type { Currency } from './currency.model'

export interface Account {
  id: string
  name: string
  integrationKind?: string
  balance: number
  currency: Currency
}

export enum MonobankAccountType {
  BLACK = 'black',
  WHITE = 'white',
  PLATINUM = 'platinum',
  IRON = 'iron',
  FOP = 'fop',
  YELLOW = 'yellow',
  E_AID = 'eAid',
}

export interface MonoBankAccount {
  id: string
  balance: number
  type: MonobankAccountType
  currencyCode: number
  currencyName: 'UAH' | 'USD' | 'EUR'
}
