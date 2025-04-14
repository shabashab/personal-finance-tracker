<script setup lang="ts">
/* Models */

/* Props and Emits */

/* Composables */
const categoriesStore = useCategoriesStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
await categoriesStore.fetchCategories()
</script>

<template>
  <div class="grid grid-cols-3 gap-5">
    <CategoryCard
      v-for="category in categoriesStore.categories"
      :key="category.id"
      :category="category"
    />
  </div>
</template>

<style scoped></style>
