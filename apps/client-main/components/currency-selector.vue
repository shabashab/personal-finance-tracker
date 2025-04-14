<script setup lang="ts">
import type { Currency } from '~/models/currency.model'

/* Models */
const modelValue = defineModel<Currency>({
  required: true,
})

/* Props and Emits */

/* Composables */
const currencyStore = useCurrencyStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <FloatLabel class="mt-3">
    <Dropdown
      v-model="modelValue"
      :options="currencyStore.availableCurrencies"
      option-label="name"
      class="w-full"
    />
    <label> Виберіть валюту </label>
  </FloatLabel>
</template>

<style scoped></style>
