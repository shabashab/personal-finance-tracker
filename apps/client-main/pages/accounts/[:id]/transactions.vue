<script setup lang="ts">
import { TransactionKind } from '~/models/transaction.model'

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
  <DataTable
    :value="transactionsStore.filteredTransaction"
    paginator
    :rows="10"
  >
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
    <Column header="Тип">
      <template #body="{ data }">
        <Icon
          v-if="data.kind === TransactionKind.INCOME"
          name="material-symbols:arrow-cool-down"
          class="text-green-500 text-2xl"
        />
        <Icon
          v-else-if="data.kind === TransactionKind.EXPENSE"
          name="material-symbols:arrow-cool-down"
          class="text-red-500 rotate-180 text-2xl"
        />
      </template>
    </Column>
    <Column header="Категорія">
      <template #body="{ data }">
        {{ formatName(data.category.name) || 'Без категорії' }}
      </template>
    </Column>
    <Column field="amount" header="Сума">
      <template #body="{ data }">
        {{ formatCurrency(data.amount, account?.currency.name ?? 'UAH') }}
      </template>
    </Column>
    <Column field="performedAt" header="Дата">
      <template #body="{ data }">
        {{
          new Date(data.performedAt).toLocaleDateString('uk-UA', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        }}
      </template>
    </Column>
  </DataTable>
</template>

<style scoped></style>
