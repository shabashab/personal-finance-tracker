import { jwtStorage } from '~/storage/jwt.storage'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (jwtStorage.get() && !authStore.user) {
    await authStore.fetchIam()
  }

  if (to.path.includes('/auth') && authStore.user) {
    return '/'
  }

  if (!to.path.includes('auth') && !authStore.user) {
    return '/auth/login'
  }
})
