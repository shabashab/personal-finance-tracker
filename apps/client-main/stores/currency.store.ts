import { currencies } from '~/api/domains/currencies'
import { CurrencyName, type Currency } from '~/models/currency.model'

export const useCurrencyStore = defineStore('currency', () => {
  const availableCurrencies = ref<Currency[]>([])

  const fetchAvailableCurrencies = async () => {
    const result = await currencies.getCurrencies.execute()
    availableCurrencies.value = result.success ? result.output : []
  }

  const getUahCurrency = (): Currency => {
    const hrivna = availableCurrencies.value.find(
      (currency) => currency.name === CurrencyName.UAH
    )

    if (!hrivna) {
      return {
        name: CurrencyName.UAH,
        id: '',
        usdExchangeRate: 42,
      }
    }
    return hrivna
  }

  const findCurrecyByName = (name: CurrencyName): Currency | undefined => {
    return availableCurrencies.value.find((currency) => currency.name === name)
  }

  return {
    availableCurrencies,
    fetchAvailableCurrencies,
    getUahCurrency,
    findCurrecyByName,
  }
})
