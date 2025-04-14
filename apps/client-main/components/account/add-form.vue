<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import type { MonoBankAccount } from '~/models/account.model'
import { monobankApiKeyStorage } from '~/storage/monobank-api.storage'
import CurrencySelector from '../currency-selector.vue'

/* Models */

/* Props and Emits */
const emit = defineEmits(['close'])

/* Composables */
const accountsStore = useAccountsStore()
const currencyStore = useCurrencyStore()
const toast = useToast()

/* Refs and Reactive Variables */
const data = ref({
  name: '',
  currency: currencyStore.getUahCurrency(),
})

const integrationData = ref({
  apiToken: monobankApiKeyStorage.get() ?? '',
})

const rules = {
  name: {
    required,
  },
}

const isIntagrationUsed = ref(false)

const vuelidate = useVuelidate(rules, data)

const prefetchedMonobankData = ref<{
  name: string
  accounts: MonoBankAccount[]
}>()

const selectedMonobankAccounts = ref<MonoBankAccount[]>([])

/* Computed Properties */

/* Methods */
const onAccountSelect = (account: MonoBankAccount) => {
  const index = selectedMonobankAccounts.value.findIndex(
    (a) => a.id === account.id
  )

  if (index !== -1) {
    return
  }

  selectedMonobankAccounts.value.push(account)
}

const onAccountRemove = (account: MonoBankAccount) => {
  const index = selectedMonobankAccounts.value.findIndex(
    (a) => a.id === account.id
  )

  if (index === -1) {
    return
  }

  selectedMonobankAccounts.value.splice(index, 1)
}

const onFormSubmited = async () => {
  if (isIntagrationUsed.value) {
    if (selectedMonobankAccounts.value.length === 0) {
      toast.add({
        severity: 'error',
        summary: 'Помилка',
        detail: 'Оберіть акаунти для інтеграції',
      })
      return
    }

    Promise.all(
      selectedMonobankAccounts.value.map((account) => {
        return accountsStore.connectMonobankAccount(account)
      })
    )
      .then(() => {
        toast.add({
          severity: 'success',
          summary: 'Успішно',
          detail: 'Акаунти успішно додані',
        })
      })
      .catch(() => {
        toast.add({
          severity: 'error',
          summary: 'Помилка',
          detail: 'Не вдалося додати акаунти',
        })
      })
  } else {
    vuelidate.value.$touch()
    if (vuelidate.value.$invalid || !data.value.currency.id) {
      toast.add({
        severity: 'error',
        summary: 'Помилка',
        detail: 'Заповніть всі поля правильно',
      })
      return
    }

    await accountsStore.createAccount(data.value.name, data.value.currency.id)

    toast.add({
      severity: 'success',
      summary: 'Успішно',
      detail: 'Акаунт успішно створено',
    })
  }

  await accountsStore.fetchAccounts()
  emit('close')
}

/* Lifecycle Hooks */
watch(
  () => integrationData.value.apiToken,
  async (newValue) => {
    if (newValue === '') {
      return
    }

    accountsStore.setMonobankApiKey(newValue)
    prefetchedMonobankData.value =
      await accountsStore.prefetchMonobankAcoounts()
  },
  { deep: true, immediate: true }
)

await currencyStore.fetchAvailableCurrencies()
</script>

<template>
  <form
    class="grid grid-cols-1 gap-5 mt-5 w-full"
    @submit.prevent="onFormSubmited"
  >
    <template v-if="!isIntagrationUsed">
      <GeneralInputWrapper label="Назва аккаунта" :validation="vuelidate.name">
        <InputText
          v-model="data.name"
          class="w-full"
          :invalid="vuelidate.name.$error"
        />
      </GeneralInputWrapper>
      <CurrencySelector v-model="data.currency" class="w-full" />
    </template>
    <div class="flex items-center gap-2">
      <Checkbox
        v-model="isIntagrationUsed"
        input-id="integration"
        :binary="true"
      />
      <label for="integration">Використовувати інтеграцію з Монобанком?</label>
    </div>
    <template v-if="isIntagrationUsed">
      <div>
        <GeneralInputWrapper label="API ключ інтеграції">
          <InputText v-model="integrationData.apiToken" class="w-full" />
        </GeneralInputWrapper>
        <NuxtLink
          to="https://api.monobank.ua/index.html"
          target="_blank"
          class="text-blue-500 text-sm"
          >Отримати ключ</NuxtLink
        >
        <div v-if="prefetchedMonobankData" :key="prefetchedMonobankData.name">
          <div>
            <h2 class="text-xl text-center my-10 px-8">
              Раді вітати!
              <span class="text-primary">{{ prefetchedMonobankData.name }}</span
              >, ми знайшли Ваші акаунти монобанку. <br />
              Будь ласка оберіть аккаунти які ви б хотіли додати до системи.
              Дякуємо за Вашу довіру!
            </h2>
          </div>
          <div class="grid grid-cols-2 gap-5 mt-5">
            <AccountMonobankSelectCard
              v-for="account in prefetchedMonobankData.accounts.sort((a, b) =>
                a.type.localeCompare(b.type)
              )"
              :key="account.id"
              :account="account"
              @account-selected="onAccountSelect($event)"
              @account-removed="onAccountRemove($event)"
            />
          </div>
        </div>
      </div>
    </template>
    <Button
      type="submit"
      :label="isIntagrationUsed ? 'Підключити аккаунти' : 'Створити аккаунт'"
      class="mt-5"
    />
  </form>
</template>

<style scoped></style>
