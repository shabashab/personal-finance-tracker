import { createModule } from '@mikrokit/di'
import { UsersRepository } from './users.repository'
import { SessionsRepository } from './sessions.repository'
import { AuthPasswordRepository } from './auth-password.repository'
import { PasswordRestoresRepository } from './password-restore.repository'
import { EmailVerificationsRepository } from './email-verifications.repository'
import { EmailVerificationTokensRepository } from './email-verification-tokens.repository'
import { CurrenciesRepository } from './currencies.repository'
import { CategoriesRepository } from './categories.repository'
import { CategoriesTemplatesRepository } from './categories-templates.repository'
import { AccountsRepository } from './accounts.repository'
import { TransactionsRepository } from './transactions.repository'
import { BalanceRepository } from './balance.repository'

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
  .provide(AccountsRepository)
  .provide(TransactionsRepository)
  .provide(BalanceRepository)
