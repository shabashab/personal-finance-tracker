import axios from 'axios'

import { Server } from 'src/api/server'
import { createTestContainer } from './container'

import { TOKEN } from './database'
import { BullMq } from 'src/queues/bullmq'
import { Transporter } from '@core/transporter'
import { NodemailerMockTransporter } from 'nodemailer-mock'

export const createTestServer = async (options?: {
  disableQueueWorkers?: boolean
}) => {
  const container = createTestContainer()
  const server = await container.inject(Server)
  const bullmq = await container.inject(BullMq)

  const transporter = (await container.inject(
    Transporter
  )) as NodemailerMockTransporter

  transporter.nodemailermock.mock.reset()

  if (!options?.disableQueueWorkers) {
    await bullmq.setup()
  }

  await server.listen()

  const serverAddress = server.server.address()

  if (!serverAddress || typeof serverAddress === 'string') {
    throw new Error('invalid server address type')
  }

  const anonymousClient = axios.create({
    baseURL: `http://localhost:${serverAddress.port}`,
    validateStatus: () => true,
  })

  const authenticatedClient = axios.create({
    baseURL: `http://localhost:${serverAddress.port}`,
    validateStatus: () => true,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })

  return {
    container,
    server,
    anonymousClient,
    authenticatedClient,
  }
}
