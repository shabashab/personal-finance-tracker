import { createModule } from '@mikrokit/di'
import { CurrenciesSeeder } from './currencies.seeder'

export const seedersModule = createModule().provide(CurrenciesSeeder)
