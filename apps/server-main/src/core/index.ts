import { createModule } from '@mikrokit/di'
import { Logger } from './logger'
import { Redis } from './redis'

export const coreModule = createModule().provide(Logger).provide(Redis)
