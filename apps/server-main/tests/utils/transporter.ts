import { Config } from '@config'
import { defineProvider } from '@mikrokit/di'

import nodemailermock from 'nodemailer-mock'

export const testTransporterFactory = defineProvider(async (injector) => {
  const config = await injector.inject(Config)

  const transporter = nodemailermock.createTransport({
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE,
    auth:
      config.SMTP_USERNAME && config.SMTP_PASSWORD
        ? {
            user: config.SMTP_USERNAME,
            pass: config.SMTP_PASSWORD,
          }
        : undefined,
  })

  return transporter
}, 'TestTransporter')
