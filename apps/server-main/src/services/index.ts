import { createModule } from '@mikrokit/di'
import { AuthService } from './auth/auth.service'

export const servicesModule = createModule().provide(AuthService)
