<script setup lang="ts">
/* Models */

/* Props and Emits */

/* Composables */
const route = useRoute()
const router = useRouter()

/* Refs and Reactive Variables */

/* Computed Properties */

/* Methods */

/* Lifecycle Hooks */
</script>

<template>
  <NuxtLayout name="centered-card">
    <div class="grid grid-cols-1 gap-5">
      <div class="grid grid-cols-2 gap-5">
        <Button
          label="Вхід"
          :outlined="route.path === '/auth/login'"
          @click="router.push('/auth/login')"
        ></Button>
        <Button
          label="Реєстрація"
          :outlined="route.path === '/auth/signup'"
          @click="router.push('/auth/signup')"
        ></Button>
      </div>
      <slot />
    </div>
    <Toast />
  </NuxtLayout>
</template>

<style scoped></style>
