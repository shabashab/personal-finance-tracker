import { Container } from '@mikrokit/di'
import { InferProviderReturnType } from '@utils'
import { Server } from 'src/api/server'
import { describe, afterEach, beforeEach, it, expect } from 'vitest'
import { Axios } from 'axios'
import { createTestServer } from 'tests/utils/server'
import { UserSelect } from '@database/schema'
import { registerUserAndVerifyEmail } from 'tests/utils/users'
import { createCategory, findAllUserCategories } from 'tests/utils/categories'

describe('POST /categories', () => {
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
    const response = await anonymousClient.post('/categories', {
      name: 'Test Category',
      kind: 'INCOME',
    })

    expect(response.status).toBe(401)
  })

  it('should return 201 and create a category for current user', async () => {
    const response = await authenticatedClient1.post('/categories', {
      name: 'test',
      kind: 'INCOME',
    })

    const userCategories = await findAllUserCategories(container, user1.id)

    expect(response.status).toBe(201)
    expect(response.data).toEqual({
      id: expect.any(String),
      name: 'test',
      kind: 'INCOME',
      isDefault: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
    expect(userCategories).toHaveLength(1)
    expect(userCategories[0]).toEqual(
      expect.objectContaining({
        id: response.data.id,
        name: 'test',
        kind: 'INCOME',
        isDefault: false,
      })
    )
  })

  it('should return 409 if category with same name and kind already exists', async () => {
    await createCategory(container, user1.id, 'test', 'INCOME', false)

    const response = await authenticatedClient1.post('/categories', {
      name: 'test',
      kind: 'INCOME',
    })

    expect(response.status).toBe(409)
    expect(response.data.details).toBe(
      'Category with this name already exists for user'
    )
  })

  it('should return 409 if default category with same name and different kind already exists', async () => {
    await createCategory(container, user1.id, 'test', 'INCOME', true)

    const response = await authenticatedClient1.post('/categories', {
      name: 'test',
      kind: 'EXPENSE',
    })

    expect(response.status).toBe(409)
    expect(response.data.details).toBe(
      'Category with this name already exists for user'
    )
  })
})
