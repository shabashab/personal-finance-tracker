export enum CurrencyName {
  USD = 'USD',
  EUR = 'EUR',
  UAH = 'UAH',
}

export interface Currency {
  id: string
  name: CurrencyName
  usdExchangeRate: number
}
