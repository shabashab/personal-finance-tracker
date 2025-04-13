import { jwtStorage } from '~/storage/jwt.storage'
import { auth } from '~/api/domains/auth'
import type { User } from '~/models/user.model'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User>()
  const isSignedIn = computed(() => !!user.value)

  const login = async (input: {
    email: string
    password: string
  }): Promise<boolean> => {
    const loginResult = await auth.login.execute({
      email: input.email,
      password: input.password,
    })

    if (loginResult.success) {
      jwtStorage.set(loginResult.output.token)
      user.value = loginResult.output.user
    }

    return loginResult.success
  }

  const fetchIam = async () => {
    const iamResult = await auth.getIam.execute()

    if (iamResult.success) {
      user.value = iamResult.output
    } else if (
      'statusCode' in iamResult.error &&
      iamResult.error.statusCode === 403
    ) {
      jwtStorage.remove()
      location.reload()
    }

    return user.value
  }

  const logOut = () => {
    jwtStorage.remove()
    user.value = undefined
  }

  return {
    user,
    isSignedIn,
    fetchIam,
    login,
    logOut,
  }
})
