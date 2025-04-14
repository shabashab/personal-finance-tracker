<script setup lang="ts">
/* Models */

/* Props and Emits */

/* Composables */
const route = useRoute()
const transactionsStore = useTransactionsStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
await transactionsStore.fetchTransactions([
  route.params.id as string,
  route.params.id as string,
])
</script>

<template>
  <div>{{ transactionsStore.filteredTransaction }}</div>
</template>

<style scoped></style>
