import { Container } from '@mikrokit/di'
import { InferProviderReturnType } from '@utils'
import { Axios } from 'axios'
import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { Server } from 'src/api/server'
import { createTestServer } from 'tests/utils/server'
import { getSentEmailsByUserEmail } from 'tests/utils/emails'
import { waitAllJobsInQueue } from 'tests/utils/wait-all-jobs'
import { SendEmailQueue } from 'src/queues/send-email.queue'

describe('POST /auth/register/password', () => {
  let container: Container
  let server: InferProviderReturnType<typeof Server>

  let anonymousClient: Axios
  let authenticatedClient: Axios

  beforeEach(async () => {
    const testServer = await createTestServer()

    container = testServer.container
    server = testServer.server
    anonymousClient = testServer.anonymousClient
    authenticatedClient = testServer.authenticatedClient
  })

  afterEach(async () => {
    await server.close()
  })

  it('should register a user with password', async () => {
    const email = 'user@example.com'

    const response = await anonymousClient.request({
      method: 'POST',
      url: '/auth/register/password',
      data: {
        email,
        password: 'password123',
      },
    })

    const sendEmailQueue = await container.inject(SendEmailQueue.queue)

    await waitAllJobsInQueue(sendEmailQueue)

    const userEmails = await getSentEmailsByUserEmail(container, email)

    expect(userEmails.length).toBe(1)

    expect(response.status).toBe(200)
  })

  it('should respond with 400 if user with same email is existing', async () => {
    const email = 'user@example.com'

    const responseWithNewUser = await anonymousClient.request({
      method: 'POST',
      url: '/auth/register/password',
      data: {
        email,
        password: 'password123',
      },
    })

    const responseWithUserEmailConflict = await anonymousClient.request({
      method: 'POST',
      url: '/auth/register/password',
      data: {
        email,
        password: 'password123',
      },
    })

    const sendEmailQueue = await container.inject(SendEmailQueue.queue)

    await waitAllJobsInQueue(sendEmailQueue)

    const userEmails = await getSentEmailsByUserEmail(container, email)

    expect(responseWithNewUser.status).toBe(200)
    expect(userEmails.length).toBe(1)

    expect(responseWithUserEmailConflict.status).toBe(400)
  })
})
