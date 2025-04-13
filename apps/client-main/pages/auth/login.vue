<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { email, required, minLength } from '@vuelidate/validators'
import { apiErrorMessage } from '~/utils/toast-messages'

definePageMeta({
  layout: 'auth',
})
/* Models */

/* Props and Emits */

/* Composables */
const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

/* Refs and Reactive Variables */
const data = ref({
  email: '',
  password: '',
})

const rules = {
  email: {
    required,
    email,
  },
  password: {
    required,
    minLength: minLength(8),
  },
}

/* Computed Properties */

const vuelidate = useVuelidate(rules, data)

/* Methods */
const onButtonCLick = async () => {
  try {
    vuelidate.value.$touch()
    if (vuelidate.value.$invalid) {
      toast.add({
        severity: 'error',
        summary: 'Помилка',
        detail: 'Заповніть всі поля правильно',
      })
      return
    }

    await authStore.login(data.value)

    toast.add({
      severity: 'success',
      summary: 'Успішно',
      detail: 'Ви успішно зареєстровані',
    })

    await router.push('/')
  } catch (error) {
    console.error(error)
    toast.add(apiErrorMessage(error))
  }
}

/* Lifecycle Hooks */
</script>

<template>
  <h1 class="text-xl text-center">Увійдіти на платформу</h1>
  <GeneralInputWrapper label="Електронна пошта" :validation="vuelidate.email">
    <InputText
      v-model="data.email"
      class="w-full"
      input-class="w-full"
      :invalid="vuelidate.email.$error"
    />
  </GeneralInputWrapper>
  <GeneralInputWrapper label="Пароль" :validation="vuelidate.password">
    <Password
      v-model="data.password"
      class="w-full"
      input-class="w-full"
      :invalid="vuelidate.password.$error"
      toggle-mask
      :feedback="false"
    />
  </GeneralInputWrapper>
  <Button label="Увійти" @click="onButtonCLick" />
</template>

<style scoped></style>
