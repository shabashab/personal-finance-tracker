<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { email, required, minLength, sameAs } from '@vuelidate/validators'
import { auth } from '~/api/domains/auth'
import { apiErrorMessage } from '~/utils/toast-messages'

definePageMeta({
  layout: 'auth',
})
/* Models */

/* Props and Emits */

/* Composables */
const toast = useToast()
const router = useRouter()

/* Refs and Reactive Variables */
const data = ref({
  email: '',
  password: '',
  passwordConfirmation: '',
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
  passwordConfirmation: {
    required,
    minLength: minLength(8),
    sameAsPassword: () => {
      return sameAs(data.value.password)
    },
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

    toast.add({
      severity: 'info',
      summary: 'Зачекайте',
      detail: 'Реєстрація...',
      life: 3000,
    })

    await auth.signup
      .execute({
        email: data.value.email,
        password: data.value.password,
      })
      .catch((error: unknown) => {
        toast.add(apiErrorMessage(error))
      })

    toast.add({
      severity: 'success',
      summary: 'Успішно',
      detail: 'Ви успішно зареєстровані',
    })

    await router.push('/auth/login')
  } catch (error) {
    console.error(error)
    toast.add(apiErrorMessage(error))
  }
}

/* Lifecycle Hooks */
</script>

<template>
  <h1 class="text-xl text-center">Створити акаунт</h1>
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
    />
  </GeneralInputWrapper>
  <GeneralInputWrapper
    label="Підтвердженя паролю"
    :validation="vuelidate.password"
  >
    <Password
      v-model="data.passwordConfirmation"
      class="w-full"
      input-class="w-full"
      :invalid="vuelidate.passwordConfirmation.$error"
      :feedback="false"
      toggle-mask
    />
  </GeneralInputWrapper>
  <Button label="Зареєструватись" @click="onButtonCLick" />
</template>

<style scoped></style>
