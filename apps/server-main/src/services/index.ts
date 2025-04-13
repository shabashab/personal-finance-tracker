import { createModule } from '@mikrokit/di'

import { UsersService } from './users.service'

import { CoreAuthService } from './core-auth.service'
import { DevelopmentAuthService as DevelopmentAuthService } from './development-auth.service'
import { PasswordAuthService } from './password-auth.service'

import { EmailsService } from './emails.service'
import { PasswordRestoreService } from './password-restore.service'
import { EmailVerificationService } from './email-verification.service'
import { CurrenciesService } from './currencies.service'
import { UsersSetupService } from './users-setup.service'
import { CategoriesService } from './categories.service'
import { CategoriesTemplatesService } from './categories-templates.service'

export const servicesModule = createModule()
  .provide(UsersService)
  .provide(UsersSetupService)

  .provide(CoreAuthService)
  .provide(PasswordAuthService)
  .provide(DevelopmentAuthService)
  .provide(PasswordRestoreService)

  .provide(EmailsService)

  .provide(EmailVerificationService)

  .provide(CurrenciesService)

  .provide(CategoriesService)
  .provide(CategoriesTemplatesService)
