import { Container } from '@mikrokit/di'
import { InferProviderReturnType } from '@utils'
import { Axios } from 'axios'
import { Server } from 'src/api/server'
import { SendEmailQueue } from 'src/queues/send-email.queue'
import { getTokenFromEmail, getSentEmailsByUserEmail } from 'tests/utils/emails'
import { createTestServer } from 'tests/utils/server'
import { registerUserByEmailAndPassword } from 'tests/utils/users'
import { waitAllJobsInQueue } from 'tests/utils/wait-all-jobs'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('POST /auth/email-verification/verify-email', () => {
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

  it('should send an email verification email', async () => {
    const email = 'user@example.com'

    await registerUserByEmailAndPassword(container, email, 'password123')

    const sendEmailQueue = await container.inject(SendEmailQueue.queue)
    await waitAllJobsInQueue(sendEmailQueue)

    const userEmails = await getSentEmailsByUserEmail(container, email)

    expect(userEmails.length).toBe(1)

    const token = getTokenFromEmail(userEmails[0])

    expect(token).toBeDefined()

    const response = await anonymousClient.request({
      method: 'POST',
      url: '/auth/email-verification/verify-email',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { token },
      data: '',
    })

    expect(response.status).toBe(200)
  })
})
