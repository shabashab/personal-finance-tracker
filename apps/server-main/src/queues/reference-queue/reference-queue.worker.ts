import { Logger } from '@core/logger'
import { defineQueueWorker } from '../_utils'
import { ReferenceQueue } from './referemce-queue.queue'

export const ReferenceQueueWorker = defineQueueWorker(
  ReferenceQueue,
  async (injector) => {
    const logger = await injector.inject(Logger)

    return async (job) => {
      logger.info(job.data.hello)
    }
  }
)
