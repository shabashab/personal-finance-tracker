import { Queue } from 'bullmq'

export const waitAllJobsInQueue = async (queue: Queue, pollInterval = 100) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    const [waiting, active] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
    ])

    if (waiting === 0 && active === 0) {
      break
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval))
  }
}
