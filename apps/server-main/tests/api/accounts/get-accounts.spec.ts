import { Container } from '@mikrokit/di'
import { InferProviderReturnType } from '@utils'
import { Server } from 'src/api/server'
import { describe, afterEach, beforeEach, it, expect } from 'vitest'
import { Axios } from 'axios'
import { createTestServer } from 'tests/utils/server'
import { UserSelect } from '@database/schema'
import { registerUserAndVerifyEmail } from 'tests/utils/users'
import { createCurrency } from 'tests/utils/currencies'
import { createAccount } from 'tests/utils/accounts'

describe('GET /accounts', () => {
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
    const response = await anonymousClient.get('/accounts')

    expect(response.status).toBe(401)
  })

  it('should return 200 and an empty list of accounts if no accounts are configured for user', async () => {
    const response = await authenticatedClient1.get('/accounts')

    expect(response.status).toBe(200)
    expect(response.data).toEqual([])
  })

  it('should return 200 and a list of accounts for current user', async () => {
    const currency1 = await createCurrency(container, 'USD', 1)
    const currency2 = await createCurrency(container, 'EUR', 1.2)

    await createAccount(container, {
      currencyId: currency1.id,
      userId: user1.id,
      name: 'Test Account 1',
    })
    await createAccount(container, {
      currencyId: currency2.id,
      userId: user1.id,
      name: 'Test Account 2',
      integration: {
        type: 'monobank',
        accountId: '1234567890',
        token: 'token',
      },
    })

    const response1 = await authenticatedClient1.get('/accounts')
    const response2 = await authenticatedClient2.get('/accounts')

    expect(response1.status).toBe(200)
    expect(response1.data).toHaveLength(2)
    expect(response1.data).toEqual([
      {
        id: expect.any(String),
        name: 'Test Account 1',

        currencyId: currency1.id,
        currency: {
          id: currency1.id,
          name: currency1.name,
          usdExchangeRate: 1,
        },

        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      {
        id: expect.any(String),
        name: 'Test Account 2',

        currencyId: currency2.id,
        currency: {
          id: currency2.id,
          name: currency2.name,
          usdExchangeRate: 1.2,
        },

        integrationKind: 'monobank',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ])

    expect(response2.status).toBe(200)
    expect(response2.data).toHaveLength(0)
  })
})
