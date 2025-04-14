<script lang="ts" setup>
const authStore = useAuthStore()
const router = useRouter()
const balanceStore = useBalanceStore()
const currencyStore = useCurrencyStore()

const navButtons = [
  {
    label: 'Мої аккаунти',
    icon: 'material-symbols:account-balance-wallet-outline-rounded',
    to: '/accounts',
  },
  {
    label: 'Категорії',
    icon: 'material-symbols:category-outline-rounded',
    to: '/categories',
  },
]

const onLogoutButtonClick = async () => {
  authStore.logOut()
  await router.push('/auth/login')
}

onMounted(async () => {
  await currencyStore.fetchAvailableCurrencies()
  await balanceStore.fetchBalance()
})
</script>

<template>
  <div>
    <header class="h-36 w-full fixed z-50 bg-[#121212]">
      <div class="container flex items-center h-full gap-6">
        <NuxtLink href="/">
          <img src="/logo.svg" class="size-16" />
        </NuxtLink>
        <div class="flex justify-center gap-5 items-center">
          <NuxtLink
            v-for="button in navButtons"
            :key="button.label"
            :to="button.to"
            class="flex items-center justify-center gap-3 text-white hover:text-primary transition-all duration-300 ease-in-out"
          >
            <Icon :name="button.icon" class="text-3xl" />
            <span class="text-xl">{{ button.label }}</span>
          </NuxtLink>
        </div>
        <div class="flex-1"></div>
        <div class="flex items-center gap-5">
          <div v-if="typeof balanceStore.balance === 'number'">
            Баланс: {{ balanceStore.balance }} UAH
          </div>
        </div>
        <Button variant="outlined" label="Вийти" @click="onLogoutButtonClick" />
      </div>
    </header>
    <div class="pt-40 z-0 container">
      <slot />
    </div>
    <Toast />
  </div>
</template>

<style lang="scss" scoped></style>
