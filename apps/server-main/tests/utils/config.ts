import { Config } from '@config'
import { defineProvider } from '@mikrokit/di'
import { type InferProviderReturnType } from '@utils'

export const testConfigFactory = defineProvider<
  InferProviderReturnType<typeof Config>
>(() => {
  return {
    DATABASE_URL: 'test',
    PORT: 0,
    REDIS_URL: '',
    REDIS_IP_FAMILY: 4,
    MAIL_FROM: 'test@example.com',
    SMTP_HOST: 'smtp.example.com',
    SMTP_PORT: 1025,
    SMTP_SECURE: false,
    SMTP_USERNAME: 'user',
    SMTP_PASSWORD: 'password',
    AUTH_ALLOW_UNVERIFIED_EMAIL_LOGIN: false,
    ENABLE_SWAGGER: false,
    ENABLE_BULL_BOARD: false,
  }
})
