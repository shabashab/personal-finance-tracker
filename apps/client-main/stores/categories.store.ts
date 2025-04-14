import { category } from '~/api/domains/category'
import type { Category } from '~/models/category.model'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])

  const fetchCategories = async () => {
    const result = await category.getCategory.execute()

    if (result.success) {
      categories.value = result.output
    }

    return result
  }

  return {
    categories,
    fetchCategories,
  }
})
