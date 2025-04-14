<script setup lang="ts">
/* Models */

/* Props and Emits */

/* Composables */
const route = useRoute()
const transactionsStore = useTransactionsStore()
const accountStore = useAccountsStore()

/* Refs and Reactive Variables */
const isAddDialogVisible = ref(false)

/* Computed Properties */
const account = computed(() =>
  accountStore.getAccountById(route.params.id as string)
)

/* Methods */

/* Lifecycle Hooks */
await transactionsStore.fetchTransactions([
  route.params.id as string,
  route.params.id as string,
])
await accountStore.fetchAccounts()
</script>

<template>
  <div>{{ transactionsStore.filteredTransaction }}</div>
  <DataTable>
    <template #header>
      <div class="flex justify-between">
        <h1 class="text-2xl text-left font-bold">
          Транзакції {{ account?.name }}
        </h1>
        <Button
          label="Додати транзакцію"
          severity="success"
          @click="isAddDialogVisible = true"
        />
        <Dialog
          v-model:visible="isAddDialogVisible"
          header="Додати транзакцію"
          modal
          class="min-w-[40vw]"
        >
          <TransactionAddForm
            v-if="account"
            :account="account"
            @close="isAddDialogVisible = false"
          />
        </Dialog>
      </div>
    </template>
  </DataTable>
</template>

<style scoped></style>
