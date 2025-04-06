import { Redis } from '@core/redis'
import { defineProvider } from '@mikrokit/di'
import RedisMemoryServer from 'redis-memory-server'
import IORedis from 'ioredis'

export const testRedisProvider = defineProvider(async () => {
  const redisServer = new RedisMemoryServer()

  const host = await redisServer.getHost()
  const port = await redisServer.getPort()

  const ioredis = new IORedis({
    host,
    port,
    // eslint-disable-next-line unicorn/no-null
    maxRetriesPerRequest: null,
  })

  return ioredis
}, Redis.token)
