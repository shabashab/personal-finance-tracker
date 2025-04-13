export interface MonobankAccount {
  id: string
  sendId: string
  balance: number
  creditLimit: number
  type: string
  currencyCode: number
  cashbackType: string
  maskedPan: string[]
  iban: string
}
