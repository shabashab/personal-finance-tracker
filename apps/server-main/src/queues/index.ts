import { createModule } from '@mikrokit/di'
import { BullMq } from './bullmq'
import { ReferenceQueue } from './reference-queue/referemce-queue.queue'
import { ReferenceQueueWorker } from './reference-queue/reference-queue.worker'
import { BullBoardQueue } from '@api/plugins/bull-board.plugin'

export const queuesModule = createModule()
  .provide(BullMq)

  // Test queue for reference, doesn't actually do anything
  .provide(ReferenceQueue)
  .provide(BullBoardQueue, ReferenceQueue)
  .provide(ReferenceQueueWorker)
