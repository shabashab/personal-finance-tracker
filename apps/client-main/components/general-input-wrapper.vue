<script setup lang="ts">
import type { VuelidateValidator } from '~/models/vuelidate-validator.model'

const props = withDefaults(
  defineProps<{
    label?: string
    validation?: VuelidateValidator
    variant?: 'primary' | 'secondary'
  }>(),
  {
    variant: 'primary',
  }
)
</script>

<template>
  <div class="grid grid-cols-1 gap-2 w-full">
    <FloatLabel class="mt-3">
      <slot class="w-full" />
      <label v-if="props.label" class="font-semibold text-white">
        {{ props.label }}
      </label>
    </FloatLabel>
    <small
      v-if="props.validation && props.validation.$error"
      class="text-xs text-red-500"
      >{{ props.validation.$errors[0].$message }}</small
    >
    <slot name="small" />
  </div>
</template>
