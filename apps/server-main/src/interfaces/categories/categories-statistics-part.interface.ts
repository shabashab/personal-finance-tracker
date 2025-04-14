import { CategorySelect } from '@database/schema'

export interface CategoriesStatisticsPart {
  period: {
    from: Date
    to: Date
  }
  data: {
    category: CategorySelect
    total: string
  }[]
}
