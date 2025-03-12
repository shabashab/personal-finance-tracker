import { defineProvider } from '@mikrokit/di'
import { WorkerGroupToken } from './_utils'

export const BullMq = defineProvider(async (injector) => {
  const workers = await injector.inject(WorkerGroupToken)

  const setup = async () => {
    process.on('exit', async () => {
      for (const worker of workers) {
        await worker.close()
      }
    })
  }

  return {
    setup,
  }
}, 'BullMq')
