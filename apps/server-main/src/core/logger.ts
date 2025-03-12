import { defineProvider } from '@mikrokit/di'
import createPino from 'pino'

export const Logger = defineProvider(() => {
  return createPino()
})
