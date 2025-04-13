import { createModule } from '@mikrokit/di'
import { CurrenciesSeeder } from './currencies.seeder'
import { CategoriesTemplatesSeeder } from './categories-templates.seeder'

export const seedersModule = createModule()
  .provide(CurrenciesSeeder)
  .provide(CategoriesTemplatesSeeder)
