<script setup lang="ts">
/* Models */
const model = defineModel<string>({
  required: true,
})

/* Props and Emits */
const props = defineProps<{
  label: string
}>()

/* Composables */

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <FloatLabel class="mt-3">
    <InputText id="input" v-model="model" class="w-full" />
    <label for="input">{{ props.label }}</label>
  </FloatLabel>
</template>

<style scoped></style>
