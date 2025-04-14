import { balance as balanceApi } from '~/api/domains/balance'
import { until } from '@vueuse/core'
import { CurrencyName } from '~/models/currency.model'

export const useBalanceStore = defineStore('balance', () => {
  const currencyStore = useCurrencyStore()

  const balance = ref<number>()

  const fetchBalance = async () => {
    await until(() => currencyStore.availableCurrencies).toMatch(
      (value) => value.length > 0
    )

    const uahCurrency = currencyStore.findCurrecyByName(CurrencyName.UAH)

    if (!uahCurrency) {
      return
    }

    const response = await balanceApi.getBalance.execute({
      currencyId: uahCurrency.id,
    })

    if (response.success) {
      balance.value = response.output.balance
    }
  }

  return {
    balance,
    fetchBalance,
  }
})
