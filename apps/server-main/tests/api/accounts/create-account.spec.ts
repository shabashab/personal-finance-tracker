import { Container } from '@mikrokit/di'
import { InferProviderReturnType } from '@utils'
import { Server } from 'src/api/server'
import { describe, afterEach, beforeEach, it, expect } from 'vitest'
import { Axios } from 'axios'
import { createTestServer } from 'tests/utils/server'
import { UserSelect } from '@database/schema'
import { registerUserAndVerifyEmail } from 'tests/utils/users'
import { createCurrency } from 'tests/utils/currencies'
import { createAccount, findAllUserAccounts } from 'tests/utils/accounts'

describe('POST /accounts', () => {
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
    const response = await anonymousClient.post('/accounts', {
      name: 'Test Account',
      currencyId: '123e4567-e89b-12d3-a456-426614174000',
    })

    expect(response.status).toBe(401)
  })

  it('should return 400 if currency does not exist', async () => {
    const response = await authenticatedClient1.post('/accounts', {
      name: 'Test Account',
      currencyId: '123e4567-e89b-12d3-a456-426614174000',
    })

    expect(response.status).toBe(400)
    expect(response.data.details).toBe(
      'Currency not found or not available for this user'
    )
  })

  it('should return 400 if currency is owned by another user', async () => {
    const currency = await createCurrency(container, 'USD', 1, user2.id)

    const response = await authenticatedClient1.post('/accounts', {
      name: 'Test Account',
      currencyId: currency.id,
    })

    expect(response.status).toBe(400)
    expect(response.data.details).toBe(
      'Currency not found or not available for this user'
    )
  })

  it('should return 422 if integration name is not a valid value', async () => {
    const currency = await createCurrency(container, 'USD', 1)

    const response = await authenticatedClient1.post('/accounts', {
      name: 'Test Account',
      currencyId: currency.id,
      integration: {
        name: 'invalid-integration-name',
      },
    })

    expect(response.status).toBe(422)
  })

  it('should return 201 and create a new account for current user if valid data', async () => {
    const currency = await createCurrency(container, 'USD', 1)

    const response = await authenticatedClient1.post('/accounts', {
      name: 'Test Account',
      currencyId: currency.id,
    })

    const userAccounts = await findAllUserAccounts(container, user1.id)

    expect(response.status).toBe(201)
    expect(response.data).toEqual({
      id: expect.any(String),
      name: 'Test Account',
      currencyId: currency.id,

      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
    expect(userAccounts).toHaveLength(1)
    expect(userAccounts[0].accounts).toEqual(
      expect.objectContaining({
        id: response.data.id,
        name: 'Test Account',
        currencyId: currency.id,
        userId: user1.id,
        // eslint-disable-next-line unicorn/no-null
        integration: null,
      })
    )
  })
})
