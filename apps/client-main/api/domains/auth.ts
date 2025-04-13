import type { User } from '~/models/user.model'
import { api } from '../api'
import type { AuthDto } from '../dto/auth.dto'

export const auth = {
  login: api.defineJsonEndpoint<
    AuthDto,
    {
      user: User
      token: string
    }
  >({
    method: 'POST',
    url: '/auth/login/password',
    output: 'naive',
    body: 'input',
    requireAuthentication: false,
  }),

  signup: api.defineJsonEndpoint<AuthDto, unknown>({
    method: 'POST',
    url: '/auth/register/password',
    output: 'naive',
    body: 'input',
    requireAuthentication: false,
  }),

  getIam: api.defineJsonEndpoint<void, User>({
    method: 'GET',
    url: '/auth/iam',
    output: 'naive',
    requireAuthentication: true,
  }),
}
