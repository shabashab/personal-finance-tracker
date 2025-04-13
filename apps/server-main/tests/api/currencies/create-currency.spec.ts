import { Container } from '@mikrokit/di'
import { InferProviderReturnType } from '@utils'
import { Server } from 'src/api/server'
import { describe, afterEach, beforeEach, it, expect } from 'vitest'
import { Axios } from 'axios'
import { createTestServer } from 'tests/utils/server'
import { UserSelect } from '@database/schema'
import { registerUserAndVerifyEmail } from 'tests/utils/users'

describe('POST /currencies', () => {
  let container: Container
  let server: InferProviderReturnType<typeof Server>

  let anonymousClient: Axios

  let authenticatedClient1: Axios
  let authenticatedClient2: Axios

  let user1: UserSelect
  let user2: UserSelect

  beforeEach(async () => {
    const testServer = await createTestServer()

    container = testServer.container
    server = testServer.server
    anonymousClient = testServer.anonymousClient

    user1 = await registerUserAndVerifyEmail(
      container,
      'test-1@test.com',
      'password'
    )
    user2 = await registerUserAndVerifyEmail(
      container,
      'test-2@test.com',
      'password'
    )
    authenticatedClient1 = await testServer.createAuthenticatedClient(user1.id)
    authenticatedClient2 = await testServer.createAuthenticatedClient(user2.id)
  })

  afterEach(async () => {
    await server.close()
  })

  it('should return 401 if not authenticated', async () => {
    const response = await anonymousClient.post('/currencies', {
      name: 'USD-2',
      usdExchangeRate: 1,
    })

    expect(response.status).toBe(401)
  })

  it('should return 422 if request body is invalid', async () => {
    const response = await authenticatedClient1.post('/currencies', {
      name: 'USD-2',
      usdExchangeRate: 'invalid',
    })

    expect(response.status).toBe(422)
  })

  it('should return 201 and create a new currency', async () => {
    const response = await authenticatedClient1.post('/currencies', {
      name: 'USD-2',
      usdExchangeRate: 1,
    })

    expect(response.status).toBe(201)
    expect(response.data).toEqual({
      id: expect.any(String),
      name: 'USD-2',
      usdExchangeRate: 1,
    })
  })

  it('should return 409 if currency already exists', async () => {
    await authenticatedClient1.post('/currencies', {
      name: 'USD-2',
      usdExchangeRate: 1,
    })

    const response = await authenticatedClient1.post('/currencies', {
      name: 'USD-2',
      usdExchangeRate: 1,
    })

    expect(response.status).toBe(409)
    expect(response.data.details).toBe(
      'Currency with the same name already exists'
    )
  })

  it('should return 201 and create a new currency with same name for different users', async () => {
    const response1 = await authenticatedClient1.post('/currencies', {
      name: 'USD-2',
      usdExchangeRate: 1,
    })

    const response2 = await authenticatedClient2.post('/currencies', {
      name: 'USD-2',
      usdExchangeRate: 1.5,
    })

    expect(response1.status).toBe(201)
    expect(response1.data).toEqual({
      id: expect.any(String),
      name: 'USD-2',
      usdExchangeRate: 1,
    })

    expect(response2.status).toBe(201)
    expect(response2.data).toEqual({
      id: expect.any(String),
      name: 'USD-2',
      usdExchangeRate: 1.5,
    })
  })
})
