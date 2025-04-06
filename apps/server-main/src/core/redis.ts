import { Config } from '@config'
import { defineProvider } from '@mikrokit/di'
import IORedis from 'ioredis'

export const Redis = defineProvider(async (injector) => {
  const config = await injector.inject(Config)
  const redis = new IORedis(config.REDIS_URL, {
    // eslint-disable-next-line unicorn/no-null
    maxRetriesPerRequest: null,
    family: config.REDIS_IP_FAMILY,
  })

  return redis
}, 'Redis')
