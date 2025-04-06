import { Container } from '@mikrokit/di'
import { InferProviderReturnType } from '@utils'
import { Axios } from 'axios'
import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { Server } from 'src/api/server'
import { createTestServer } from 'tests/utils/server'
import { getSentEmailsByUserEmail } from 'tests/utils/emails'
import { waitAllJobsInQueue } from 'tests/utils/wait-all-jobs'
import { SendEmailQueue } from 'src/queues/send-email.queue'
import {
  registerUserAndVerifyEmail,
  registerUserByEmailAndPassword,
} from 'tests/utils/users'
import { Config } from '@config'

describe('POST /auth/login/password', () => {
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

  it('should login a user with password if user email is not verified and AUTH_ALLOW_UNVERIFIED_EMAIL_LOGIN=true', async () => {
    const config = await container.inject(Config)
    config.AUTH_ALLOW_UNVERIFIED_EMAIL_LOGIN = true

    const email = 'user@example.com'

    await registerUserByEmailAndPassword(container, email, 'password123')

    const sendEmailQueue = await container.inject(SendEmailQueue.queue)
    await waitAllJobsInQueue(sendEmailQueue)

    const userEmails = await getSentEmailsByUserEmail(container, email)

    expect(userEmails.length).toBe(1)

    const loginResponse = await anonymousClient.request({
      method: 'POST',
      url: '/auth/login/password',
      data: {
        email,
        password: 'password123',
      },
    })

    expect(loginResponse.status).toBe(200)
    expect(loginResponse.data).toHaveProperty('token')
    expect(loginResponse.data).toHaveProperty('user')
  })

  it('should login a user with password if user email is verified and AUTH_ALLOW_UNVERIFIED_EMAIL_LOGIN=false', async () => {
    const config = await container.inject(Config)
    config.AUTH_ALLOW_UNVERIFIED_EMAIL_LOGIN = false

    const email = 'user@example.com'

    await registerUserAndVerifyEmail(container, email, 'password123')

    const loginResponse = await anonymousClient.request({
      method: 'POST',
      url: '/auth/login/password',
      data: {
        email,
        password: 'password123',
      },
    })

    expect(loginResponse.status).toBe(200)
    expect(loginResponse.data).toHaveProperty('token')
    expect(loginResponse.data).toHaveProperty('user')
  })

  it('should respond with 404 if user email is not verified and AUTH_ALLOW_UNVERIFIED_EMAIL_LOGIN=false', async () => {
    const config = await container.inject(Config)
    config.AUTH_ALLOW_UNVERIFIED_EMAIL_LOGIN = false

    const email = 'user@example.com'

    await registerUserByEmailAndPassword(container, email, 'password123')

    const sendEmailQueue = await container.inject(SendEmailQueue.queue)
    await waitAllJobsInQueue(sendEmailQueue)

    const userEmails = await getSentEmailsByUserEmail(container, email)

    expect(userEmails.length).toBe(1)

    const loginResponse = await anonymousClient.request({
      method: 'POST',
      url: '/auth/login/password',
      data: {
        email,
        password: 'password123',
      },
    })

    expect(loginResponse.status).toBe(401)
  })

  it('should respond with 401 if password is incorrect', async () => {
    const email = 'user@example.com'

    await registerUserByEmailAndPassword(container, email, 'password123')

    const sendEmailQueue = await container.inject(SendEmailQueue.queue)
    await waitAllJobsInQueue(sendEmailQueue)

    const userEmails = await getSentEmailsByUserEmail(container, email)

    expect(userEmails.length).toBe(1)

    const loginResponse = await anonymousClient.request({
      method: 'POST',
      url: '/auth/login/password',
      data: {
        email,
        password: 'wrongPassword',
      },
    })

    expect(loginResponse.status).toBe(401)
  })
})
