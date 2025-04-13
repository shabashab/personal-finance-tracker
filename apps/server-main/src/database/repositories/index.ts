import { createModule } from '@mikrokit/di'
import { UsersRepository } from './users.repository'
import { SessionsRepository } from './sessions.repository'
import { AuthPasswordRepository } from './auth-password.repository'
import { PasswordRestoresRepository } from './password-restore.repository'
import { EmailVerificationsRepository } from './email-verifications.repository'
import { EmailVerificationTokensRepository } from './email-verification-tokens.repository'
import { CurrenciesRepository } from './currencies.repository'
import { CategoriesRepository } from './categories.respository'
import { CategoriesTemplatesRepository } from './categories-templates.repository'

export const repositoriesModule = createModule()
  .provide(UsersRepository)
  .provide(SessionsRepository)
  .provide(AuthPasswordRepository)
  .provide(PasswordRestoresRepository)
  .provide(EmailVerificationsRepository)
  .provide(EmailVerificationTokensRepository)
  .provide(CurrenciesRepository)
  .provide(CategoriesRepository)
  .provide(CategoriesTemplatesRepository)
