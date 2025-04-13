import { Container } from '@mikrokit/di'
import { InferProviderReturnType } from '@utils'
import { Axios } from 'axios'
import { Server } from 'src/api/server'
import { createTestServer } from 'tests/utils/server'
import { registerUserAndVerifyEmail } from 'tests/utils/users'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('GET /auth/iam', () => {
  let container: Container
  let server: InferProviderReturnType<typeof Server>

  let anonymousClient: Axios
  let authenticatedClient: Axios

  beforeEach(async () => {
    const testServer = await createTestServer()

    container = testServer.container
    server = testServer.server
    anonymousClient = testServer.anonymousClient

    const authUser = await registerUserAndVerifyEmail(
      container,
      'test@test.com',
      'password'
    )

    authenticatedClient = await testServer.createAuthenticatedClient(
      authUser.id
    )
  })

  afterEach(async () => {
    await server.close()
  })

  it('should respond with 200 if user is authenticated', async () => {
    const response = await authenticatedClient.request({
      method: 'GET',
      url: '/auth/iam',
    })

    expect(response.status).toBe(200)
  })

  it('should respond with 401 if user is not authenticated', async () => {
    const response = await anonymousClient.request({
      method: 'GET',
      url: '/auth/iam',
    })

    expect(response.status).toBe(401)
  })
})
