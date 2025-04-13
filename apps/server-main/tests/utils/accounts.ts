import { UserId } from '@database/schema'
import { Container } from '@mikrokit/di'
import { AccountsService } from '@services/accounts.service'
import { AccountCreateData } from 'src/interfaces/accounts/account-create-data.interface'

export const createAccount = async (
  container: Container,
  accountData: AccountCreateData
) => {
  const accountsService = await container.inject(AccountsService)
  const account = await accountsService.createAccount(accountData)

  return account
}

export const findAllUserAccounts = async (
  container: Container,
  userId: UserId
) => {
  const accountsService = await container.inject(AccountsService)
  const accounts =
    await accountsService.findAllAccountsWithCurrencyByUserId(userId)

  return accounts
}
