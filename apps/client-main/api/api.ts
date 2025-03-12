import { createHttpApi } from '@api-def/provider-http'
import { jwtStorage } from '~/storage/jwt.storage'

export const api = createHttpApi({
  baseUrl: import.meta.env.NUXT_PUBLIC_API_BASE_URL,
  authenticationStrategy: {
    getIsAuthenticated: () => {
      return !!jwtStorage.get()
    },
    authenticateRequest: (request) => {
      const newHeaders = new Headers(request.headers)
      newHeaders.set('Authorization', `Bearer ${jwtStorage.get()}`)

      request.headers = newHeaders

      return request
    },
    defaultAuthenticationRequired: true,
  },
})
