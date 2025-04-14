import { balance } from '~/api/domains/balance'
import { category } from '~/api/domains/category'
import type { CategoryStatistics } from '~/models/category.model'

export const useStatisticsStore = defineStore('statistics', () => {
  const categoriesStatistics = ref<CategoryStatistics>(
    [] as unknown as CategoryStatistics
  )
  const balanceStatistics = ref<Record<string, string>[]>([])

  const currecyStore = useCurrencyStore()

  const fetchCategoriesStatistics = async () => {
    const result = await category.getStatistics.execute({
      currencyId: currecyStore.getUahCurrency().id,
    })

    if (result.success) {
      categoriesStatistics.value = result.output
    }
  }

  const fetchBalanceStatistics = async () => {
    const result = await balance.getStatistics.execute({
      currencyId: currecyStore.getUahCurrency().id,
    })

    if (result.success) {
      balanceStatistics.value = result.output
    }
  }

  const fetchStatistics = async () => {
    await currecyStore.fetchAvailableCurrencies()
    await fetchCategoriesStatistics()
    await fetchBalanceStatistics()
  }

  return {
    categoriesStatistics,
    balanceStatistics,
    fetchStatistics,
  }
})
