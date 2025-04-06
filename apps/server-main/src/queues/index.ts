import { BullMq } from './bullmq'
import { createModule } from '@mikrokit/di'

import { SendEmailQueue } from './send-email.queue'

export const queuesModule = createModule()
  .provide(BullMq)

  .import(SendEmailQueue)
