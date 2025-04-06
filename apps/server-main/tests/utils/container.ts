import { createContainer } from '@mikrokit/di'
import { Config } from '@config'
import { testConfigFactory } from './config'
import { testDatabaseModule } from './database'
import { coreModule } from '@core'
import { servicesModule } from '@services/index'
import { apiModule } from 'src/api'
import { queuesModule } from 'src/queues'

import { Transporter } from '@core/transporter'
import { testTransporterFactory } from './transporter'

import { Redis } from '@core/redis'
import { testRedisProvider } from './redis'

export const createTestContainer = () => {
  const container = createContainer()
    .import(coreModule)
    .import(testDatabaseModule)
    .import(servicesModule)
    .import(apiModule)
    .import(queuesModule)

    .provide(Config, testConfigFactory)
    .provide(Transporter, testTransporterFactory, { override: true })
    .provide(Redis, testRedisProvider, { override: true })

  return container
}
