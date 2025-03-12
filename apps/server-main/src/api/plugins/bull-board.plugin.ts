import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { FastifyAdapter } from '@bull-board/fastify'
import { createGroupProviderToken, defineProvider } from '@mikrokit/di'
import { Queue } from 'bullmq'

export const BULL_BOARD_BASE_PATH = '/queues'

export const BullBoardQueue =
  createGroupProviderToken<Queue<unknown>>('BullBoardQueue')

export const BullBoardPlugin = defineProvider(async (injector) => {
  const queues = await injector.inject(BullBoardQueue)

  const serverAdapter = new FastifyAdapter()

  createBullBoard({
    queues: queues.map((q) => new BullMQAdapter(q)),
    serverAdapter,
  })

  serverAdapter.setBasePath(BULL_BOARD_BASE_PATH)

  return serverAdapter.registerPlugin()
}, 'BullBoardPlugin')
