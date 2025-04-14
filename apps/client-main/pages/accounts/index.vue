<script setup lang="ts">
/* Models */

/* Props and Emits */

/* Composables */
const accountsStore = useAccountsStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */
await accountsStore.fetchAccounts()

/* Lifecycle Hooks */
</script>

<template>
  <div v-if="accountsStore.currentAccounts.length === 0">
    <h1 class="text-xl text-center font-bold my-10">
      У вас немає жодного аккаунта. <br />
      Будь ласка створіть або додайте аккаунт до системи.
    </h1>
  </div>
  <div class="flex justify-between">
    <h1
      v-if="accountsStore.currentAccounts.length > 0"
      class="text-2xl text-lefy font-bold"
    >
      Мої аккаунти
    </h1>
    <AccountAddButton />
  </div>
  <div
    :key="accountsStore.currentAccounts.length"
    class="grid grid-cols-3 gap-8 mt-20"
  >
    <AccountCard
      v-for="account in accountsStore.currentAccounts"
      :key="account.id"
      :account="account"
    />
  </div>
</template>

<style scoped></style>
