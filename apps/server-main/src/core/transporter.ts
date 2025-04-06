import { Config } from '@config'
import { defineProvider } from '@mikrokit/di'

import nodemailer from 'nodemailer'

export const Transporter = defineProvider(async (injector) => {
  const config = await injector.inject(Config)

  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
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
}, 'Transporter')
