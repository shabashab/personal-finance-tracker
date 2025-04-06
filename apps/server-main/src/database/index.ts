import { createModule } from '@mikrokit/di'
import { Database } from './drizzle'
import { repositoriesModule } from './repositories'
import { seedersModule } from './seeders'

export const databaseModule = createModule()
  .import(repositoriesModule)
  .import(seedersModule)
  .provide(Database)
