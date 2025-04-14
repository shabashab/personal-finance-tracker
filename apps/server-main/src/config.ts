import { defineProvider } from '@mikrokit/di'
import { z } from 'zod'
import { configDotenv } from 'dotenv'

if (process.env['NODE_ENV'] !== 'production') {
  configDotenv()
}

const ConfigSchema = z.object({
  PORT: z.coerce.number(),

  DATABASE_URL: z.string(),

  REDIS_URL: z.string(),
  REDIS_IP_FAMILY: z.coerce.number().default(4),

  APP_BASE_URL: z.string(),

  MAIL_FROM: z.string(),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_SECURE: z.preprocess(
    (value) => value === 'true',
    z.boolean().default(false)
  ),
  SMTP_USERNAME: z.string(),
  SMTP_PASSWORD: z.string(),

  AUTH_ALLOW_UNVERIFIED_EMAIL_LOGIN: z.preprocess(
    (value) => value === 'true',
    z.boolean().default(false)
  ),

  ENABLE_SWAGGER: z.preprocess(
    (value) => value === 'true',
    z.boolean().default(false)
  ),
  ENABLE_BULL_BOARD: z.preprocess(
    (value) => value === 'true',
    z.boolean().default(false)
  ),
})

export const Config = defineProvider(() => {
  const environment = process.env

  const config = ConfigSchema.parse(environment)

  return config
})
