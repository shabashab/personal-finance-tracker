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
  <div class="flex justify-center">
    <AccountAddButton />
  </div>
  <div>{{ accountsStore.currentAccounts }}</div>
</template>

<style scoped></style>
