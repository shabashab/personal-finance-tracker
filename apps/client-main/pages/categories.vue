<script setup lang="ts">
import { CategoryAddForm } from '#components'

/* Models */

/* Props and Emits */

/* Composables */
const categoriesStore = useCategoriesStore()

/* Refs and Reactive Variables */
const isAddCategoryDialogVisible = ref(false)

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
await categoriesStore.fetchCategories()
</script>

<template>
  <div class="flex justify-end">
    <Button
      label="Додати категорію"
      @click="isAddCategoryDialogVisible = true"
    />
    <Dialog
      v-model:visible="isAddCategoryDialogVisible"
      header="Додати категорію"
      class="min-w-[30vw]"
      modal
    >
      <CategoryAddForm @close="isAddCategoryDialogVisible = false" />
    </Dialog>
  </div>
  <div class="grid grid-cols-3 gap-5 mt-5">
    <CategoryCard
      v-for="category in categoriesStore.categories"
      :key="category.id"
      :category="category"
    />
  </div>
</template>

<style scoped></style>
