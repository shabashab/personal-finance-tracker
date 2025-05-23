import { createModule } from '@mikrokit/di'
import { HealthController } from './health/health.controller'
import { AuthController } from './auth/auth.controller'
import { PasswordRestoreController } from './auth/password-restore.controller'
import { EmailVerificationController } from './auth/email-verification.controller'
import { CurrenciesController } from './currencies/currencies.controller'
import { CategoriesController } from './categories/categories.controller'
import { AccountsController } from './accounts/accounts.controller'
import { MonobankIntegrationController } from './integrations/monobank-integration.controller'
import { TransactionsController } from './transactions/transactions.controller'
import { BalanceController } from './balance/balance.controller'

export const controllersModule = createModule()
  .provide(HealthController)

  .provide(AuthController)
  .provide(PasswordRestoreController)
  .provide(EmailVerificationController)

  .provide(CurrenciesController)

  .provide(CategoriesController)
  .provide(AccountsController)

  .provide(MonobankIntegrationController)
  .provide(TransactionsController)
  .provide(BalanceController)
