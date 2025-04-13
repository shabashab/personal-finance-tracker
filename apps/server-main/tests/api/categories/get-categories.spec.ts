import { Container } from '@mikrokit/di'
import { InferProviderReturnType } from '@utils'
import { Server } from 'src/api/server'
import { describe, afterEach, beforeEach, it, expect } from 'vitest'
import { Axios } from 'axios'
import { createTestServer } from 'tests/utils/server'
import { UserSelect } from '@database/schema'
import { registerUserAndVerifyEmail } from 'tests/utils/users'
import { createCategory } from 'tests/utils/categories'

describe('GET /categories', () => {
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
    const response = await anonymousClient.get('/categories')

    expect(response.status).toBe(401)
  })

  // Usually we would have default list of categories, but as we aren't using categories templates seeder, we won't have any
  it('should return 200 and an empty list of categories if no categories are configured for user', async () => {
    const response = await authenticatedClient1.get('/categories')

    expect(response.status).toBe(200)
    expect(response.data).toEqual([])
  })

  it('should return 200 and an empty list of categories if categories are configured for another user', async () => {
    await createCategory(container, user2.id, 'Test category', 'INCOME', false)

    const response = await authenticatedClient1.get('/categories')

    expect(response.status).toBe(200)
    expect(response.data).toEqual([])
  })

  it('should return 200 and a valid list of categories if categories are configured for user', async () => {
    await createCategory(container, user1.id, 'Test category', 'INCOME', false)
    await createCategory(
      container,
      user1.id,
      'Test category 2',
      'EXPENSE',
      true
    )

    const response = await authenticatedClient1.get('/categories')

    expect(response.status).toBe(200)
    expect(response.data).toEqual([
      {
        id: expect.any(String),
        name: 'Test category',
        kind: 'INCOME',
        isDefault: false,
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
      },
      {
        id: expect.any(String),
        name: 'Test category 2',
        kind: 'EXPENSE',
        isDefault: true,
        updatedAt: expect.any(String),
        createdAt: expect.any(String),
      },
    ])
  })
})
