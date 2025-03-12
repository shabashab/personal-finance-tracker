import { createModule } from '@mikrokit/di'
import { HealthController } from './health.controller'
import { AuthController } from './auth.controller'

export const controllersModule = createModule()
  .provide(HealthController)
  .provide(AuthController)
