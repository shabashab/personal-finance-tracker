export enum CategoryKind {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Category {
  id: string
  kind: CategoryKind
  name: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface CategoryStatistics {
  incomes: {
    period: { from: string; to: string }
    data: {
      category: Category
      total: number
    }[]
  }[]
  expenses: {
    period: { from: string; to: string }
    data: {
      category: Category
      total: number
    }[]
  }[]
}
