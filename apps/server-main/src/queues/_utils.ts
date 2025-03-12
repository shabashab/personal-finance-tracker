import { Logger } from '@core/logger'
import { Redis } from '@core/redis'
import {
  defineProvider,
  TokenizedProviderFactory,
  SingleProviderToken,
  Injector,
  createGroupProviderToken,
} from '@mikrokit/di'
import { Processor, Queue, QueueOptions, Worker, WorkerOptions } from 'bullmq'

export const WorkerGroupToken = createGroupProviderToken<Worker>('BullMqWorker')

export type QueueTokenizedProviderFactory<TJobData extends object> =
  TokenizedProviderFactory<
    Queue<TJobData>,
    SingleProviderToken<Queue<TJobData>>
  > & {
    queueName: string
  }

export const defineQueue = <TJobData extends object>(
  queueName: string,
  options?: Omit<QueueOptions, 'connection'>
): QueueTokenizedProviderFactory<TJobData> => {
  const providerFactory = defineProvider(async (injector) => {
    const redis = await injector.inject(Redis)

    const queue = new Queue<TJobData>(queueName, {
      connection: redis,
      ...(options ?? {}),
    })

    return queue
  })

  return Object.assign(providerFactory, { queueName })
}

export const defineQueueWorker = <TJobData extends object>(
  queueFactory: QueueTokenizedProviderFactory<TJobData>,
  workerFactory: (injector: Injector) => Promise<
    | Processor<TJobData>
    | {
        processor: Processor<TJobData>
        options: Omit<WorkerOptions, 'connection'>
      }
  >
) => {
  return defineProvider(async (injector) => {
    const redis = await injector.inject(Redis)
    const logger = await injector.inject(Logger)
    const createdWorkerData = await workerFactory(injector)

    const worker = (() => {
      if (typeof createdWorkerData === 'object') {
        return new Worker<TJobData>(
          queueFactory.queueName,
          createdWorkerData.processor,
          {
            connection: redis,
            ...createdWorkerData.options,
          }
        )
      }

      return new Worker<TJobData>(queueFactory.queueName, createdWorkerData, {
        connection: redis,
      })
    })()

    worker.on('active', (job) => {
      logger.info(
        {
          eventType: 'job-active',
          name: job.queueName,

          startTime: job.timestamp,
          jobName: job.name,
          id: job.id,
          data: job.data,
        },
        `Job ${job.name} started (id ${job.id}) on queue ${job.queueName} at ${job.timestamp}`
      )
    })

    worker.on('completed', (job) => {
      logger.info(
        {
          eventType: 'job-completed',
          name: job.queueName,

          startTime: job.timestamp,
          finishedOn: job.finishedOn,
          attemptsMade: job.attemptsMade,
          jobName: job.name,
          id: job.id,
          data: job.data,
        },
        `Job ${job.name} finished (id ${job.id}) on queue ${job.queueName} at ${job.finishedOn}`
      )
    })

    worker.on('failed', (job) => {
      logger.info(
        {
          eventType: 'job-failed',
          name: job?.queueName,

          startTime: job?.timestamp,
          finishedOn: job?.finishedOn,
          reason: job?.failedReason,
          attemptsMade: job?.attemptsMade,
          jobName: job?.name,
          id: job?.id,
          data: job?.data,
        },
        job
          ? `Job ${job.name} finished (id ${job.id}) on queue ${job.queueName} at ${job.finishedOn}`
          : `Job failed on queue ${queueFactory.queueName}, job unknkown`
      )
    })

    worker.on('error', (err) => {
      logger.error(
        err,
        `Error happened while executing worker for queue ${queueFactory.queueName}`
      )
    })

    return worker
  }, WorkerGroupToken)
}
