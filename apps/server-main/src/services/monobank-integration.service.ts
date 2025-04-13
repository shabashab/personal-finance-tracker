import { defineProvider } from '@mikrokit/di'
import { MonobankApiService } from './monobank-api.service'
import { Redis } from '@core/redis'
import { MonobankClientInfo } from '@interfaces/integrations/monobank-client-info.interface'

const CLIENT_INFO_CACHE_PREFIX = 'monobank:client-info'
const CLIENT_INFO_CACHE_TTL_SECONDS = 60

export const MonobankIntegrationService = defineProvider(async (injector) => {
  const redis = await injector.inject(Redis)
  const monobankApiService = await injector.inject(MonobankApiService)

  const fetchClientInfoByTokenCached = async (
    token: string
  ): Promise<MonobankClientInfo> => {
    const cacheKey = `${CLIENT_INFO_CACHE_PREFIX}:${token}`
    const cachedClientInfoRaw = await redis.get(cacheKey)

    if (cachedClientInfoRaw) {
      const cachedClientInfo = JSON.parse(
        cachedClientInfoRaw
      ) as MonobankClientInfo

      return cachedClientInfo
    }

    const clientInfo = await monobankApiService.fetchClientInfoByToken(token)

    await redis.setex(
      cacheKey,
      CLIENT_INFO_CACHE_TTL_SECONDS,
      JSON.stringify(clientInfo)
    )

    return clientInfo
  }

  return {
    fetchClientInfoByTokenCached,
  }
}, 'MonobankIntegrationService')
