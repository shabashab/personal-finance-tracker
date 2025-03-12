import { defineProvider } from '@mikrokit/di'
import { z } from 'zod'
import { configDotenv } from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  configDotenv()
}

const ConfigSchema = z.object({
  PORT: z.coerce.number(),
  JWT_SECRET: z.string(),

  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
})

export const Config = defineProvider(() => {
  const env = process.env

  const config = ConfigSchema.parse(env)

  return config
})
