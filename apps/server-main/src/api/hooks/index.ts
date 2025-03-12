import { createModule } from '@mikrokit/di'
import { RequireAuthHook } from './require-auth.hook'

export const hooksModule = createModule().provide(RequireAuthHook)
