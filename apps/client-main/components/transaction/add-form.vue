<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { minValue, required } from '@vuelidate/validators'
import { transactions } from '~/api/domains/transactions'
import type { Account } from '~/models/account.model'
import type { Category, CategoryKind } from '~/models/category.model'
import { TransactionKind } from '~/models/transaction.model'

/* Models */

/* Props and Emits */
const props = defineProps<{
  account: Account
}>()

const emit = defineEmits(['close'])

/* Composables */
const toast = useToast()
const transactionsStore = useTransactionsStore()

/* Refs and Reactive Variables */
const data = ref<{
  kind: TransactionKind
  amount: number | undefined
  category: Category | undefined
}>({
  kind: TransactionKind.INCOME,
  amount: undefined,
  category: undefined,
})

const rules = {
  kind: {
    required,
  },
  amount: {
    required,
    minValue: minValue(0),
  },
  category: {
    required,
  },
}

const vuelidate = useVuelidate(rules, data)

const transactionKindOptions = ref([
  {
    value: TransactionKind.INCOME,
    label: 'Вхідна',
  },
  {
    value: TransactionKind.EXPENSE,
    label: 'Трата',
  },
])

/* Computed Properties */

/* Methods */
const onFormSubmit = async () => {
  vuelidate.value.$touch()

  if (vuelidate.value.$invalid) {
    return
  }

  const result = await transactions.createTransaction.execute({
    amount: data.value.amount ?? 0,
    kind: data.value.kind,
    categoryId: data.value.category?.id ?? '',
    accountId: props.account.id,
    performedAt: new Date(),
  })

  if (result.success) {
    toast.add({
      severity: 'success',
      summary: 'Транзакцію успішно створено',
      detail: 'Транзакцію успішно створено',
    })

    await transactionsStore.fetchTransactions([
      props.account.id,
      props.account.id,
    ])

    emit('close')
  }
}

/* Lifecycle Hooks */
</script>

<template>
  <form class="grid grid-cols-1 gap-5 mt-3" @submit.prevent="onFormSubmit">
    <div>
      Оберіть вид транзакції
      <SelectButton
        v-model="data.kind"
        :options="transactionKindOptions"
        option-label="label"
        option-value="value"
        class="w-full mt-2"
      />
    </div>
    <GeneralInputWrapper label="Сума" :validation="vuelidate.amount">
      <InputNumber
        v-model="data.amount"
        mode="currency"
        :invalid="vuelidate.amount.$error"
        :currency="props.account.currency.name"
        :min="0"
        class="w-full"
      />
    </GeneralInputWrapper>
    <GeneralInputWrapper label="Категорія" :validation="vuelidate.category">
      <CategorySelect
        v-model="data.category"
        :kind-filter="data.kind as unknown as CategoryKind"
        :invalid="vuelidate.category.$error"
        class="w-full"
      />
    </GeneralInputWrapper>
    <Button label="Створити транзакцію" type="submit" severity="success" />
  </form>
</template>

<style scoped></style>
