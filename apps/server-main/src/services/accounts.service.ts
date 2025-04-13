import { AccountsRepository } from '@database/repositories/accounts.repository'
import { CurrencyId, IntegrationData, UserId } from '@database/schema'
import { defineProvider } from '@mikrokit/di'
import { CurrenciesService } from './currencies.service'
import { BadRequestException } from '@api/exceptions/bad-request.exception'
import { AccountCreateData } from '@interfaces/accounts/account-create-data.interface'

export const AccountsService = defineProvider(async (injector) => {
  const accountsRepository = await injector.inject(AccountsRepository)
  const currenciesService = await injector.inject(CurrenciesService)

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

  return {
    findAllAccountsWithCurrencyByUserId:
      accountsRepository.findAllAccountsWithCurrencyByUserId,
    createAccount,
    findAccountById: accountsRepository.findAccountById,
  }
}, 'AccountsService')
