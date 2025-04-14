<!-- eslint-disable @typescript-eslint/no-unsafe-argument -->
<!-- eslint-disable @typescript-eslint/no-unsafe-return -->
<script setup lang="ts">
import Chart from 'primevue/chart'

/* Models */

/* Props and Emits */

/* Composables */
const statisticsStore = useStatisticsStore()

/* Refs and Reactive Variables */

/* Computed Properties */
const incomesDataSet = computed(() => {
  return {
    labels: statisticsStore.categoriesStatistics.incomes[3].data.map(
      ({ category }) => formatName(category.name)
    ),
    datasets: [
      {
        label: 'Сумарно отримано в гривнях',
        data: statisticsStore.categoriesStatistics.incomes[3].data.map(
          ({ total }) => total
        ),
        backgroundColor:
          statisticsStore.categoriesStatistics.incomes[3].data.map(
            (_item, index) => generateGreenColorByIndex(index)
          ),
      },
    ],
  }
})

const expensesDataSet = computed(() => {
  return {
    labels: statisticsStore.categoriesStatistics.expenses[3].data.map(
      ({ category }) => formatName(category.name)
    ),
    datasets: [
      {
        label: 'Сумарно витрачено в гривнях',
        data: statisticsStore.categoriesStatistics.expenses[3].data.map(
          ({ total }) => total
        ),
        backgroundColor:
          statisticsStore.categoriesStatistics.expenses[3].data.map(
            (_item, index) => generateRedColorByIndex(index)
          ),
      },
    ],
  }
})

const balanceChartData = computed(() => {
  return {
    labels: Object.keys(statisticsStore.balanceStatistics).reverse(),
    datasets: [
      {
        label: 'Баланс',
        data: Object.values(statisticsStore.balanceStatistics).reverse(),
      },
    ],
  }
})

/* Methods */
const generateGreenColorByIndex = (index: number) => {
  const baseGreen = [76, 175, 80] // RGB for #4CAF50
  const variation = (index % 7) * 15 // Adjust brightness/darkness
  const adjustedGreen = baseGreen.map((value) =>
    Math.max(0, Math.min(255, value - variation))
  )
  return `rgb(${adjustedGreen.join(',')})`
}

const generateRedColorByIndex = (index: number) => {
  const baseRed = [244, 67, 54] // RGB for #F44336
  const variation = (index % 7) * 15 // Adjust brightness/darkness
  const adjustedRed = baseRed.map((value) =>
    Math.max(0, Math.min(255, value - variation))
  )
  return `rgb(${adjustedRed.join(',')})`
}

/* Lifecycle Hooks */
await statisticsStore.fetchStatistics()
</script>

<template>
  <div class="grid grid-cols-[80%_20%] gap-10 items-center">
    <div class="row-span-2">
      <div class="text-center text-xl font-semibold my-3">
        Баланс за останні 30 днів
      </div>
      <Chart type="line" :data="balanceChartData" />
    </div>
    <div>
      <div class="text-center text-xl font-semibold my-3">
        Дохід за категоріями
      </div>
      <Chart type="doughnut" :data="incomesDataSet" class="w-full" />
    </div>
    <div>
      <div class="text-center text-xl font-semibold my-3">
        Трати за категоріями
      </div>
      <Chart type="doughnut" :data="expensesDataSet" class="w-full" />
    </div>
  </div>
</template>

<style scoped></style>
