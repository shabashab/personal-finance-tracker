import { Container } from '@mikrokit/di'
import { InferProviderReturnType } from '@utils'
import { Axios } from 'axios'
import { Server } from 'src/api/server'
import { SendEmailQueue } from 'src/queues/send-email.queue'
import { getSentEmailsByUserEmail, getTokenFromEmail } from 'tests/utils/emails'
import { initPasswordRestore } from 'tests/utils/init-password-restore'
import { createTestServer } from 'tests/utils/server'
import { registerUserAndVerifyEmail } from 'tests/utils/users'
import { waitAllJobsInQueue } from 'tests/utils/wait-all-jobs'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('POST /auth/password-restore/restore', () => {
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

  it('should restore user password', async () => {
    const email = 'user@example.com'

    await registerUserAndVerifyEmail(container, email, 'password123')
    await initPasswordRestore(container, email)

    const sendEmailQueue = await container.inject(SendEmailQueue.queue)

    await waitAllJobsInQueue(sendEmailQueue)

    const userEmails = await getSentEmailsByUserEmail(container, email)

    expect(userEmails.length).toBe(2)

    const passwordRestoreToken = getTokenFromEmail(userEmails[1])

    expect(passwordRestoreToken).toBeDefined()

    const response = await anonymousClient.request({
      method: 'POST',
      url: '/auth/password-restore/restore',
      data: {
        token: passwordRestoreToken,
        newPassword: 'newPassword',
      },
    })

    expect(response.status).toBe(200)
  })

  it('should respond with 400 if old and new password are the same', async () => {
    const email = 'user@example.com'

    await registerUserAndVerifyEmail(container, email, 'password123')
    await initPasswordRestore(container, email)

    const sendEmailQueue = await container.inject(SendEmailQueue.queue)

    await waitAllJobsInQueue(sendEmailQueue)

    const userEmails = await getSentEmailsByUserEmail(container, email)

    expect(userEmails.length).toBe(2)

    const passwordRestoreToken = getTokenFromEmail(userEmails[1])

    expect(passwordRestoreToken).toBeDefined()

    const response = await anonymousClient.request({
      method: 'POST',
      url: '/auth/password-restore/restore',
      data: {
        token: passwordRestoreToken,
        newPassword: 'password123',
      },
    })

    expect(response.status).toBe(400)
  })

  it('should respond with 400 if newer password restore token exists', async () => {
    const email = 'user@example.com'

    await registerUserAndVerifyEmail(container, email, 'password123')

    await initPasswordRestore(container, email)
    await initPasswordRestore(container, email)

    const sendEmailQueue = await container.inject(SendEmailQueue.queue)

    await waitAllJobsInQueue(sendEmailQueue)

    const userEmails = await getSentEmailsByUserEmail(container, email)

    expect(userEmails.length).toBe(3)

    const passwordRestoreToken = getTokenFromEmail(userEmails[1])

    expect(passwordRestoreToken).toBeDefined()

    const response = await anonymousClient.request({
      method: 'POST',
      url: '/auth/password-restore/restore',
      data: {
        token: passwordRestoreToken,
        newPassword: 'password123',
      },
    })

    expect(response.status).toBe(400)
  })
})
