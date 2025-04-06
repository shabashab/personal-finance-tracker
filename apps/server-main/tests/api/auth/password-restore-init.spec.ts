import { Container } from '@mikrokit/di'
import { InferProviderReturnType } from '@utils'
import { Axios, AxiosResponse } from 'axios'
import { Server } from 'src/api/server'
import { SendEmailQueue } from 'src/queues/send-email.queue'
import { getSentEmailsByUserEmail, getTokenFromEmail } from 'tests/utils/emails'
import { createTestServer } from 'tests/utils/server'
import { registerUserAndVerifyEmail } from 'tests/utils/users'
import { waitAllJobsInQueue } from 'tests/utils/wait-all-jobs'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('POST /auth/password-restore/init', () => {
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

  it('should send a password restore email', async () => {
    const email = 'user@example.com'

    await registerUserAndVerifyEmail(container, email, 'password123')

    const sendEmailQueue = await container.inject(SendEmailQueue.queue)

    await waitAllJobsInQueue(sendEmailQueue)

    const response = await anonymousClient.request({
      method: 'POST',
      url: '/auth/password-restore/init',
      data: {
        email,
      },
    })

    await waitAllJobsInQueue(sendEmailQueue)

    const userEmails = await getSentEmailsByUserEmail(container, email)

    // first email is for email verification
    // second email is for password restore
    expect(userEmails.length).toBe(2)

    const passwordRestoreToken = getTokenFromEmail(userEmails[1])

    expect(passwordRestoreToken).toBeDefined()

    expect(response.status).toBe(200)
  })

  it('should respond with 400 if too many requests in init attempts were made', async () => {
    const email = 'user@example.com'

    await registerUserAndVerifyEmail(container, email, 'password123')

    const sendEmailQueue = await container.inject(SendEmailQueue.queue)

    await waitAllJobsInQueue(sendEmailQueue)

    const initAttempts = Array.from({ length: 5 }).map(() =>
      anonymousClient.request({
        method: 'POST',
        url: '/auth/password-restore/init',
        data: { email },
      })
    )

    await Promise.all(initAttempts)

    await waitAllJobsInQueue(sendEmailQueue)

    const userEmails = await getSentEmailsByUserEmail(container, email)

    // first email is for email verification
    // five next emails are for password restore
    expect(userEmails.length).toBe(6)

    const response = await anonymousClient.request({
      method: 'POST',
      url: '/auth/password-restore/init',
      data: {
        email,
      },
    })

    expect(response.status).toBe(400)
  })
})
