import { createModule } from '@mikrokit/di'
import { Database } from './drizzle'
import { repositoriesModule } from './repositories'

export const databaseModule = createModule()
  .import(repositoriesModule)
  .provide(Database)
