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
    <div class="grid grid-cols-1 gap-10">
      <div class="grid grid-cols-2 gap-5">
        <Button
          label="Увійти"
          :outlined="route.path === '/auth/login'"
          @click="router.push('/auth/login')"
        ></Button>
        <Button
          label="Регістрація"
          :outlined="route.path === '/auth/signup'"
          @click="router.push('/auth/signup')"
        ></Button>
      </div>
      <slot />
    </div>
  </NuxtLayout>
</template>

<style scoped></style>
