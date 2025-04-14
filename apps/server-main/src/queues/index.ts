import { BullMq } from './bullmq'
import { createModule } from '@mikrokit/di'

import { SendEmailQueue } from './send-email.queue'
import { HandleMonobankWebhookQueue } from './handle-monobank-webhook.queue'

export const queuesModule = createModule()
  .provide(BullMq)

  .import(SendEmailQueue)
  .import(HandleMonobankWebhookQueue)
