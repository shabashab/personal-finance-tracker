import { createModule } from '@mikrokit/di'
import { HealthController } from './health/health.controller'
import { AuthController } from './auth/auth.controller'
import { PasswordRestoreController } from './auth/password-restore.controller'
import { EmailVerificationController } from './auth/email-verification.controller'

export const controllersModule = createModule()
  .provide(HealthController)

  .provide(AuthController)
  .provide(PasswordRestoreController)
  .provide(EmailVerificationController)
