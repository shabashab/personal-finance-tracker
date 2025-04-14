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
