<script setup lang="ts">
/* Models */

/* Props and Emits */

/* Composables */
const isDialogVisible = ref(false)

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */
const onAddButtonClick = () => {
  isDialogVisible.value = true
}

/* Lifecycle Hooks */
</script>

<template>
  <Button label="Додати аккаунт" severity="success" @click="onAddButtonClick" />
  <Dialog
    v-model:visible="isDialogVisible"
    modal
    class="min-w-[40vw]"
    header="Додати аккаунт до системи"
  >
    <AccountAddForm @close="isDialogVisible = false" />
  </Dialog>
</template>

<style scoped></style>
