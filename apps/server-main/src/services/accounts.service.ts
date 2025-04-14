import { AccountsRepository } from '@database/repositories/accounts.repository'
import { UserId } from '@database/schema'
import { defineProvider } from '@mikrokit/di'
import { CurrenciesService } from './currencies.service'
import { BadRequestException } from '@api/exceptions/bad-request.exception'
import { AccountCreateData } from '@interfaces/accounts/account-create-data.interface'
import { BalanceService } from './balance.service'
import { FullAccount } from '@interfaces/accounts/full-account.interface'
import { ConflictException } from '@api/exceptions/conflict.exception'
import { MonobankIntegrationService } from './monobank-integration.service'
import { Logger } from '@core/logger'

export const AccountsService = defineProvider(async (injector) => {
  const accountsRepository = await injector.inject(AccountsRepository)
  const currenciesService = await injector.inject(CurrenciesService)
  const balanceService = await injector.inject(BalanceService)
  const logger = await injector.inject(Logger)
  const monobankIntegrationService = await injector.inject(
    MonobankIntegrationService
  )

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

    let initialBalance: number | undefined

    if (accountData.integration) {
      const existingAccount =
        await accountsRepository.findAccountByMonobankAccountId(
          accountData.integration.accountId
        )

      if (existingAccount) {
        throw new ConflictException(
          'Account with this monobank account id already exists'
        )
      }

      const monobankClientInfo =
        await monobankIntegrationService.fetchClientInfoByTokenCached(
          accountData.integration.token
        )

      const monobankAccount = monobankClientInfo.accounts.find(
        (account) => account.id === accountData.integration!.accountId
      )

      if (!monobankAccount) {
        throw new BadRequestException('Account id is invalid')
      }

      if (monobankAccount.currencyCode !== currency.currencyCode) {
        throw new BadRequestException(
          'Currency code of the account and the currency do not match'
        )
      }

      initialBalance = monobankAccount.balance / 100
    }

    const createdAccount = await accountsRepository.createAccount({
      ...accountData,
      initialBalance,
    })

    if (accountData.integration) {
      await monobankIntegrationService
        .setupWebhookForToken(accountData.integration.token)
        .catch((error: unknown) => {
          logger.error(error, 'Failed to setup webhook')
        })
    }

    return createdAccount
  }

  const findAllFullAccountsByUserId = async (
    userId: UserId
  ): Promise<FullAccount[]> => {
    const accounts =
      await accountsRepository.findAllAccountsWithCurrencyByUserId(userId)

    const balances = await balanceService.findBalancesByAccountIds(
      accounts.map((account) => account.accounts.id)
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
    findAccountByMonobankAccountId:
      accountsRepository.findAccountByMonobankAccountId,
  }
}, 'AccountsService')
