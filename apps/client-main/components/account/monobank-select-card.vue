<script setup lang="ts">
import {
  MonobankAccountType,
  type MonoBankAccount,
} from '~/models/account.model'

/* Models */

/* Props and Emits */
const props = defineProps<{
  account: MonoBankAccount
}>()

const emit = defineEmits(['accountSelected', 'accountRemoved'])

/* Composables */

/* Refs and Reactive Variables */
const isSelected = ref(false)

/* Computed Properties */

/* Methods */
const getBackgroundColorByType = () => {
  const options = {
    [MonobankAccountType.BLACK]: 'bg-black hover:bg-gray-800',
    [MonobankAccountType.WHITE]: 'bg-white text-black hover:bg-gray-200',
    [MonobankAccountType.PLATINUM]: 'bg-pink-300 hover:bg-pink-400 text-black',
    [MonobankAccountType.IRON]: 'bg-gray-500 hover:bg-gray-400',
    [MonobankAccountType.YELLOW]: 'bg-yellow-500 hover:bg-yellow-400',
    [MonobankAccountType.E_AID]: 'bg-green-500 hover:bg-green-400',
    [MonobankAccountType.FOP]: 'bg-blue-500 hover:bg-blue-400',
  }

  return options[props.account.type]
}

const getTypeLabel = () => {
  const options = {
    [MonobankAccountType.BLACK]: 'Чорна',
    [MonobankAccountType.WHITE]: 'Біла',
    [MonobankAccountType.PLATINUM]: 'Платинова',
    [MonobankAccountType.IRON]: 'Залізна',
    [MonobankAccountType.YELLOW]: 'Жовта (дитяча)',
    [MonobankAccountType.E_AID]: 'Є-підтримка',
    [MonobankAccountType.FOP]: 'ФОП',
  }

  return options[props.account.type]
}

/* Lifecycle Hooks */
watch(
  () => isSelected,
  (newValue) => {
    if (newValue.value) {
      emit('accountSelected', props.account)
    } else {
      emit('accountRemoved', props.account)
    }
  },
  {
    deep: true,
    immediate: true,
  }
)
</script>

<template>
  <div
    :class="[
      getBackgroundColorByType(),
      isSelected ? 'border-8 border-primary' : 'border-8 border-transparent',
    ]"
    class="cursor-pointer px-4 py-2 shadow-md duration-200"
    @click="isSelected = !isSelected"
  >
    <div class="flex items-start justify-between">
      <div class="grid grid-cols-1 gap-3 text-xl">
        <div>
          Тип картки: <span class="font-semibold">{{ getTypeLabel() }}</span>
        </div>
        <div>
          Баланс:
          <span class="font-semibold"
            >{{
              formatCurrency(props.account.balance, props.account.currencyName)
            }}
          </span>
        </div>
      </div>
      <img class="size-24" src="/monobank-cat.webp" />
    </div>
  </div>
</template>

<style scoped></style>
