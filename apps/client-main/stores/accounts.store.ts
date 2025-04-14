/* eslint-disable unicorn/consistent-function-scoping */
import { account } from '~/api/domains/account'
import { monobank } from '~/api/domains/monobank'
import {
  MonobankAccountType,
  type Account,
  type MonoBankAccount,
} from '~/models/account.model'
import type { CurrencyName } from '~/models/currency.model'
import { monobankApiKeyStorage } from '~/storage/monobank-api.storage'

export const useAccountsStore = defineStore('accounts', () => {
  const currentAccounts = ref<Account[]>([])
  const currecyStore = useCurrencyStore()

  const fetchAccounts = async () => {
    const result = await account.getAccounts.execute()

    currentAccounts.value = result.success ? result.output : []
  }

  const prefetchMonobankAcoounts = async () => {
    const apiKey = monobankApiKeyStorage.get()

    if (!apiKey) {
      return
    }

    const result = await monobank.prefetchTokenInfo.execute({
      apiKey,
    })

    return result.success ? result.output : undefined
  }

  const setMonobankApiKey = (apiKey: string) => {
    monobankApiKeyStorage.set(apiKey)
  }

  const createAccount = async (name: string, currencyId: string) => {
    return await account.createAccount.execute({
      name,
      currencyId,
      integration: undefined,
    })
  }

  const getAccountNameByMonobankAccount = (
    account: MonoBankAccount
  ): string => {
    const options = {
      [MonobankAccountType.BLACK]: 'Карта Чорна',
      [MonobankAccountType.WHITE]: 'Карта Біла',
      [MonobankAccountType.PLATINUM]: 'Карта Платинова',
      [MonobankAccountType.IRON]: 'Карта Залізна',
      [MonobankAccountType.YELLOW]: 'Карта Жовта (дитяча)',
      [MonobankAccountType.E_AID]: 'Карта Є-підтримка',
      [MonobankAccountType.FOP]: 'Рахунок ФОП',
    }

    return `${options[account.type]} ${account.currencyName}`
  }

  const connectMonobankAccount = async (
    integrationAccount: MonoBankAccount
  ) => {
    if (currecyStore.availableCurrencies.length === 0) {
      await currecyStore.fetchAvailableCurrencies()
    }

    const currency = currecyStore.findCurrecyByName(
      integrationAccount.currencyName as CurrencyName
    )

    if (!currency) {
      throw new Error('Currency not found')
    }

    const result = await account.createAccount.execute({
      name: getAccountNameByMonobankAccount(integrationAccount),
      currencyId: currency.id,
      integration: {
        type: 'monobank',
        token: monobankApiKeyStorage.get() ?? '',
        accountId: integrationAccount.id,
      },
    })

    if (!result.success) {
      throw new Error('Failed to create account')
    }

    return result.output
  }

  return {
    currentAccounts,
    fetchAccounts,
    setMonobankApiKey,
    prefetchMonobankAcoounts,
    createAccount,
    connectMonobankAccount,
    getAccountNameByMonobankAccount,
  }
})
