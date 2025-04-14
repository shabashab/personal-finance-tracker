<script setup lang="ts">
import { CategoryKind, type Category } from '~/models/category.model'

/* Models */

/* Props and Emits */
const props = defineProps<{
  category: Category
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <div
    class="min-h-20 border-2 border-gray-300 rounded-lg px-4 py-2 shadow-md flex justify-between items-center"
    :class="[
      category.kind === CategoryKind.INCOME ? 'bg-green-900' : 'bg-red-900',
    ]"
  >
    <div class="text-center w-full font-semibold text-lg">
      {{ formatName(props.category.name) }}
    </div>
  </div>
</template>

<style scoped></style>
