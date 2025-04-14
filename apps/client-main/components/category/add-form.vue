<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { maxLength, minLength, required } from '@vuelidate/validators'
import { CategoryKind } from '~/models/category.model'
import GeneralInputWrapper from '../general-input-wrapper.vue'
import { InputText } from '#components'
import { category } from '~/api/domains/category'

/* Models */

/* Props and Emits */
const emit = defineEmits(['close'])

/* Composables */
const toast = useToast()
const categoriesStore = useCategoriesStore()

/* Refs and Reactive Variables */
const data = ref({
  name: '',
  kind: CategoryKind.INCOME,
})

const rules = ref({
  name: {
    required,
    min: minLength(3),
    max: maxLength(50),
  },
})

const vuelidate = useVuelidate(rules, data)

const categoryKindOptions = ref([
  {
    value: CategoryKind.INCOME,
    label: 'Вхідна',
  },
  {
    value: CategoryKind.EXPENSE,
    label: 'Трата',
  },
])

/* Computed Properties */

/* Methods */
const onFormSubmit = async () => {
  if (vuelidate.value.$invalid) {
    return
  }

  const result = await category.createCategory.execute({
    name: data.value.name,
    kind: data.value.kind,
  })

  if (result.success) {
    toast.add({
      severity: 'success',
      summary: 'Додавання категорії',
      detail: 'Категорію успішно додано',
    })

    await categoriesStore.fetchCategories()

    emit('close')
  }
}

/* Lifecycle Hooks */
</script>

<template>
  <form class="grid gird-cols-1 gap-5 mt-3" @submit.prevent="onFormSubmit">
    <GeneralInputWrapper label="Назва категорії" vuelidate="vuelidate.name">
      <InputText
        v-model="data.name"
        class="w-full"
        :invalid="vuelidate.name.$error"
      />
    </GeneralInputWrapper>
    <div>
      Оберіть вид категорії
      <SelectButton
        v-model="data.kind"
        :options="categoryKindOptions"
        option-label="label"
        option-value="value"
        class="w-full mt-2"
      />
    </div>
    <Button label="Додати категорію" type="submit" />
  </form>
</template>

<style scoped></style>
