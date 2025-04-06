import { defineProvider } from '@mikrokit/di'
import { BadRequestException } from '@api/exceptions/bad-request.exception'

import { Config } from '@config'
import { Transporter } from '@core/transporter'

import { SendEmailOptions } from './interfaces/send-email-options.interface'
import { SendEmailJobData } from 'src/queues/send-email.queue'

export const EmailsService = defineProvider(async (injector) => {
  const config = await injector.inject(Config)
  const transporter = await injector.inject(Transporter)

  const sendFromJobData = async (jobData: SendEmailJobData) => {
    const emailData = await createEmailDataFromJobData(jobData)

    await sendEmailOrThrow(jobData.to, emailData.content, {
      contentType: emailData.type,
      subject: jobData.subject,
    })
  }

  const createEmailDataFromJobData = async (
    jobData: SendEmailJobData
  ): Promise<{
    content: string
    type: SendEmailOptions['contentType']
  }> => {
    if (!jobData.content) {
      throw new Error('email_content_not_provided')
    }

    return {
      content: jobData.content,
      type: jobData.contentType ?? 'html',
    }
  }

  const sendEmailOrThrow = async (
    to: string,
    content: string,
    options: SendEmailOptions = {}
  ) => {
    try {
      await transporter.sendMail({
        from: options.from ?? config.MAIL_FROM,
        to,
        subject: options.subject,
        html: options.contentType === 'plain' ? undefined : content,
        text: options.contentType === 'plain' ? content : undefined,
      })
    } catch {
      throw new BadRequestException('email_send_error')
    }
  }

  return {
    sendEmailOrThrow,
    sendFromJobData,
  }
}, 'MailsService')
