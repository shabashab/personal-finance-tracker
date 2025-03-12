import { defineQueue } from '../_utils'

// This is queue created only for reference on how to create queues in this project
// It can be deleted after real queues are created

export const ReferenceQueue =
  defineQueue<ReferenceQueueJobData>('reference-queue')
