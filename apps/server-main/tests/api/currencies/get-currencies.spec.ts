import { Container } from '@mikrokit/di'
import { InferProviderReturnType } from '@utils'
import { Server } from 'src/api/server'
import { describe, afterEach, beforeEach, it, expect } from 'vitest'
import { Axios } from 'axios'
import { createTestServer } from 'tests/utils/server'
import { UserSelect } from '@database/schema'
import { createCurrency } from 'tests/utils/currencies'
import { registerUserAndVerifyEmail } from 'tests/utils/users'

describe('GET /currencies', () => {
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
    const response = await anonymousClient.get('/currencies')

    expect(response.status).toBe(401)
  })

  it('should return 200 and an empty list of currencies if no currencies are configured', async () => {
    const response = await authenticatedClient1.get('/currencies')

    expect(response.status).toBe(200)
    expect(response.data).toEqual([])
  })

  it('should return 200 and all global currencies if user does not have own users configured', async () => {
    await createCurrency(container, 'USD', 1)
    await createCurrency(container, 'TEST', 2)

    const expectedResponse = [
      { id: expect.any(String), name: 'USD', usdExchangeRate: 1 },
      { id: expect.any(String), name: 'TEST', usdExchangeRate: 2 },
    ]

    const response1 = await authenticatedClient1.get('/currencies')
    const response2 = await authenticatedClient2.get('/currencies')

    expect(response1.status).toBe(200)
    expect(Array.isArray(response1.data)).toBe(true)
    expect(response1.data.length).toBe(2)
    expect(response1.data).toEqual(expectedResponse)

    expect(response2.status).toBe(200)
    expect(Array.isArray(response2.data)).toBe(true)
    expect(response2.data.length).toBe(2)
    expect(response2.data).toEqual(expectedResponse)

    expect(response1.data).toEqual(response2.data)
  })

  it('should return 200 and all global currencies alongside with user-configured currencies if user has custom currencies configured', async () => {
    await createCurrency(container, 'USD', 1)
    await createCurrency(container, 'TEST', 2)
    await createCurrency(container, 'USER-TEST', 3, user1.id)

    const expectedResponse1 = [
      { id: expect.any(String), name: 'USD', usdExchangeRate: 1 },
      { id: expect.any(String), name: 'TEST', usdExchangeRate: 2 },
      { id: expect.any(String), name: 'USER-TEST', usdExchangeRate: 3 },
    ]

    const expectedResponse2 = [
      { id: expect.any(String), name: 'USD', usdExchangeRate: 1 },
      { id: expect.any(String), name: 'TEST', usdExchangeRate: 2 },
    ]

    const response1 = await authenticatedClient1.get('/currencies')
    const response2 = await authenticatedClient2.get('/currencies')

    expect(response1.status).toBe(200)
    expect(Array.isArray(response1.data)).toBe(true)
    expect(response1.data.length).toBe(3)
    expect(response1.data).toEqual(expectedResponse1)

    expect(response2.status).toBe(200)
    expect(Array.isArray(response2.data)).toBe(true)
    expect(response2.data.length).toBe(2)
    expect(response2.data).toEqual(expectedResponse2)
  })
})
