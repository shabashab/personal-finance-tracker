export interface CreateAccountDto {
  name: string
  currencyId: string
  integration:
    | {
        type: 'monobank'
        token: string
        accountId: string
      }
    | undefined
}
