import { MonobankWebhookService } from '@services/monobank-webhook.service'
import { defineQueue } from './_utils'

export const HandleMonobankWebhookQueue = defineQueue<object>(
  'handle-monobank-webhook',
  async (injector) => {
    const monobankWebhookService = await injector.inject(MonobankWebhookService)

    return async (job) => {
      await monobankWebhookService.handleMonobankWebhook(job.data)
    }
  }
)
