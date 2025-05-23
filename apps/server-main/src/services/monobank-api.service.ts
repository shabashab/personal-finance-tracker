import { BadRequestException } from '@api/exceptions/bad-request.exception'
import { TooManyRequestsException } from '@api/exceptions/too-many-requests.exception'
import { Logger } from '@core/logger'
import { MonobankClientInfo } from '@interfaces/integrations/monobank-client-info.interface'
import { defineProvider } from '@mikrokit/di'
import axios from 'axios'

/**
 * Wrapper around monobank API.
 * Please do not use this service directly as it doesn't add caches and endpoints are highly rate-limited.
 * For most cases, use `MonobankIntegrationService` instead.
 */
export const MonobankApiService = defineProvider(async (injector) => {
  const logger = await injector.inject(Logger)

  const fetchClientInfoByToken = async (
    token: string
  ): Promise<MonobankClientInfo> => {
    try {
      const axiosInstance = createAxiosInstanceByToken(token)
      const response = await axiosInstance.get<MonobankClientInfo>(
        '/personal/client-info'
      )

      return response.data
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        throw error
      }

      if (error.response?.status === 403) {
        throw new BadRequestException('Invalid token')
      }

      if (error.response?.status === 429) {
        throw new TooManyRequestsException('Too many requests')
      }

      throw new BadRequestException('Invalid token')
    }
  }

  const setWebhookForToken = async (token: string, webhookUrl: string) => {
    try {
      const axiosInstance = createAxiosInstanceByToken(token)
      await axiosInstance.post('/personal/webhook', { webHookUrl: webhookUrl })
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        throw error
      }

      logger.error(error.response, 'Failed to set webhook for token')

      if (error.response?.status === 403) {
        throw new BadRequestException('Invalid token')
      }

      if (error.response?.status === 429) {
        throw new TooManyRequestsException('Too many requests')
      }

      throw new BadRequestException('Invalid token')
    }
  }

  const createAxiosInstanceByToken = (token: string) => {
    return axios.create({
      baseURL: 'https://api.monobank.ua',
      headers: {
        'X-Token': token,
      },
    })
  }

  return {
    fetchClientInfoByToken,
    setWebhookForToken,
  }
}, 'MonobankApiService')
