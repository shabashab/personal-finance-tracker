import { AccountsRepository } from '@database/repositories/accounts.repository'
import { CurrencyId, UserId } from '@database/schema'
import { defineProvider } from '@mikrokit/di'
import { CurrenciesService } from './currencies.service'
import { BadRequestException } from '@api/exceptions/bad-request.exception'
import { AccountCreateData } from '@interfaces/accounts/account-create-data.interface'
import { BalanceService } from './balance.service'
import { FullAccount } from '@interfaces/accounts/full-account.interface'

export const AccountsService = defineProvider(async (injector) => {
  const accountsRepository = await injector.inject(AccountsRepository)
  const currenciesService = await injector.inject(CurrenciesService)
  const balanceService = await injector.inject(BalanceService)

  const createAccount = async (accountData: AccountCreateData) => {
    const currency = await currenciesService.findCurrencyById(
      accountData.currencyId
    )

    if (
      !currency ||
      (currency.userId && currency.userId !== accountData.userId)
    ) {
      throw new BadRequestException(
        'Currency not found or not available for this user'
      )
    }

    return await accountsRepository.createAccount(accountData)
  }

  const findAllFullAccountsByUserId = async (
    userId: UserId,
    balanceCurrencyId: CurrencyId
  ): Promise<FullAccount[]> => {
    const accounts =
      await accountsRepository.findAllAccountsWithCurrencyByUserId(userId)

    const balances = await balanceService.findBalancesByAccountIds(
      accounts.map((account) => account.accounts.id),
      balanceCurrencyId
    )

    return accounts.map((account) => ({
      ...account.accounts,
      currency: account.currencies,
      balance: balances.get(account.accounts.id) ?? '0',
    }))
  }

  return {
    findAllAccountsWithCurrencyByUserId:
      accountsRepository.findAllAccountsWithCurrencyByUserId,
    createAccount,
    findAccountById: accountsRepository.findAccountById,
    findAllFullAccountsByUserId,
  }
}, 'AccountsService')
