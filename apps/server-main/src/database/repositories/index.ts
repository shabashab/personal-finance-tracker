import { createModule } from '@mikrokit/di'
import { UsersRepository } from './users.repository'

export const repositoriesModule = createModule().provide(UsersRepository)
