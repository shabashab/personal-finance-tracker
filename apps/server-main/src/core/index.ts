import { createModule } from '@mikrokit/di'
import { Logger } from './logger'
import { Redis } from './redis'
import { Transporter } from './transporter'

export const coreModule = createModule()
  .provide(Logger)
  .provide(Redis)
  .provide(Transporter)
