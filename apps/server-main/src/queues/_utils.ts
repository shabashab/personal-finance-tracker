/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Module,
  Injector,
  createModule,
  defineProvider,
  SingleProviderToken,
  createGroupProviderToken,
  TokenizedProviderFactory,
} from '@mikrokit/di'
import { Redis } from '@core/redis'
import { Logger } from '@core/logger'
import { BullBoardQueue } from '@api/plugins/bull-board.plugin'
import { Processor, Queue, QueueOptions, Worker, WorkerOptions } from 'bullmq'

export const WorkerGroupToken = createGroupProviderToken<Worker>('BullMqWorker')

export type QueueTokenizedProviderFactory<TJobData extends object> =
  TokenizedProviderFactory<
    Queue<TJobData>,
    SingleProviderToken<Queue<TJobData>>
  > & {
    queueName: string
  }

export type WorkerFactory<TJobData> = (injector: Injector) => Promise<
  | Processor<TJobData>
  | {
      processor: Processor<TJobData>
      options: Omit<WorkerOptions, 'connection'>
    }
>

export function defineQueue<TJobData extends object>(
  queueName: string,
  options?: Omit<QueueOptions, 'connection'>
): Module & { queue: QueueTokenizedProviderFactory<TJobData> }

export function defineQueue<TJobData extends object>(
  queueName: string,
  workerFactory: WorkerFactory<TJobData>,
  options?: Omit<QueueOptions, 'connection'>
): Module & {
  queue: QueueTokenizedProviderFactory<TJobData>
  worker: TokenizedProviderFactory<
    Worker<TJobData, any, any>,
    SingleProviderToken<Worker<TJobData, any, any>>
  >
}

export function defineQueue<TJobData extends object>(
  queueName: string,
  optionsOrWorkerFactory?:
    | Omit<QueueOptions, 'connection'>
    | WorkerFactory<TJobData>,
  options?: Omit<QueueOptions, 'connection'>
):
  | (Module & { queue: QueueTokenizedProviderFactory<TJobData> })
  | (Module & {
      queue: QueueTokenizedProviderFactory<TJobData>
      worker: TokenizedProviderFactory<
        Worker<TJobData, any, any>,
        SingleProviderToken<Worker<TJobData, any, any>>
      >
    }) {
  const module = createModule()

  const queueOptions =
    typeof optionsOrWorkerFactory === 'object' &&
    !('processor' in optionsOrWorkerFactory)
      ? optionsOrWorkerFactory
      : options
  const queue = defineQueueProvider<TJobData>(queueName, queueOptions)

  module.provide(queue)
  module.provide(BullBoardQueue, queue)

  // It is a queue without worker
  if (
    !optionsOrWorkerFactory ||
    (typeof optionsOrWorkerFactory === 'object' &&
      !('processor' in optionsOrWorkerFactory))
  ) {
    return Object.assign(module, { queue })
  }

  const worker = defineQueueWorker(
    queue,
    optionsOrWorkerFactory as WorkerFactory<TJobData>
  )

  module.provide(worker)

  return Object.assign(module, { queue, worker })
}

const defineQueueProvider = <TJobData extends object>(
  queueName: string,
  options?: Omit<QueueOptions, 'connection'>
): QueueTokenizedProviderFactory<TJobData> => {
  const providerFactory = defineProvider(async (injector) => {
    const redis = await injector.inject(Redis)

    const queue = new Queue<TJobData>(queueName, {
      connection: redis,
      ...options,
    })

    return queue
  })

  return Object.assign(providerFactory, { queueName })
}

export const defineQueueWorker = <TJobData extends object>(
  queueFactory:
    | QueueTokenizedProviderFactory<TJobData>
    | (Module & { queue: QueueTokenizedProviderFactory<TJobData> }),
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
    const queueName =
      'queue' in queueFactory
        ? queueFactory.queue.queueName
        : queueFactory.queueName

    const worker = (() => {
      if (typeof createdWorkerData === 'object') {
        return new Worker<TJobData>(queueName, createdWorkerData.processor, {
          connection: redis,
          ...createdWorkerData.options,
        })
      }

      return new Worker<TJobData>(queueName, createdWorkerData, {
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
          : `Job failed on queue ${queueName}, job unknkown`
      )
    })

    worker.on('error', (error) => {
      logger.error(
        error,
        `Error happened while executing worker for queue ${queueName}`
      )
    })

    return worker
  }, WorkerGroupToken)
}
