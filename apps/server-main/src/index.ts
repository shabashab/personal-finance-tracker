import { createContainer } from '@mikrokit/di'
import { servicesModule } from './services'
import { databaseModule } from './database'
import { apiModule } from './api'
import { Server } from './api/server'
import { coreModule } from '@core'
import { Config } from '@config'
import { Logger } from '@core/logger'
import { queuesModule } from './queues'
import { ReferenceQueue } from './queues/reference-queue/referemce-queue.queue'
import { BullMq } from './queues/bullmq'

const container = createContainer()
  .import(coreModule)
  .import(databaseModule)
  .import(servicesModule)
  .import(apiModule)
  .import(queuesModule)
  .provide(Config)

const bootstrap = async () => {
  const server = await container.inject(Server)
  const logger = await container.inject(Logger)
  const config = await container.inject(Config)
  const bullmq = await container.inject(BullMq)

  const referenceQueue = await container.inject(ReferenceQueue)

  bullmq.setup()
  await server.listen({
    port: config.PORT,
    host: '0.0.0.0',
  })

  logger.info(
    `Documentation is available at http://localhost:${config.PORT}/documentation`
  )
  logger.info(
    `Bull board is available at http://localhost:${config.PORT}/queues`
  )

  // await referenceQueue.add('test-job', {
  //   hello: 'world',
  // })
}

bootstrap()
