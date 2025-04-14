export interface Account {
  id: string
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
