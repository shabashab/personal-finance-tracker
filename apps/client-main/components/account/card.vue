<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { Account } from '~/models/account.model'

/* Models */

/* Props and Emits */
const props = defineProps<{
  account: Account
}>()

/* Composables */
const router = useRouter()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div
    class="border border-gray-300 rounded-lg p-4 shadow-md min-h-36 hover:bg-gray-800 transition-all duration-300 ease-in-out cursor-pointer"
    @click="router.push(`/accounts/${props.account.id}/transactions`)"
  >
    <div class="flex justify-between">
      <div class="grid grid-cols-1 gap-2">
        <div class="text-primary font-bold text-lg">
          {{ props.account.name }}
        </div>
        <div class="text-2xl">
          <span class="font-semibold">{{
            formatCurrency(props.account.balance, props.account.currency.name)
          }}</span>
        </div>
      </div>
      <img
        v-if="account.integrationKind === 'monobank'"
        src="/monobank-cat.webp"
        class="size-32"
      />
    </div>
  </div>
</template>

<style scoped></style>
