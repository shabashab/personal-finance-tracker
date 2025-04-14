<script setup lang="ts">
import type { Category, CategoryKind } from '~/models/category.model'

/* Models */
const modelValue = defineModel<Category | undefined>({
  required: true,
})

/* Props and Emits */
const props = defineProps<{
  kindFilter: CategoryKind
}>()

/* Composables */
const categoriesStore = useCategoriesStore()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
await categoriesStore.fetchCategories()
</script>

<template>
  <Select
    v-model="modelValue"
    :options="
      categoriesStore.categories.filter((c) => c.kind === props.kindFilter) ??
      []
    "
    :kind-filter="props.kindFilter"
    class="w-full"
  >
    <template #value="{ value }">
      <div v-if="value">
        {{ formatName(value?.name) }}
      </div>
      <div v-else class="text-transparent">0</div>
    </template>
    <template #option="{ option }">
      <div>
        {{ formatName(option.name) }}
      </div>
    </template>
  </Select>
</template>

<style scoped></style>
