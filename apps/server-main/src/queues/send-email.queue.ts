import { defineQueue } from './_utils'
import { EmailsService } from '@services/emails.service'

export interface SendEmailJobData {
  to: string
  subject: string

  content?: string
  contentType?: 'html' | 'plain'
}

export const SendEmailQueue = defineQueue<SendEmailJobData>(
  'send-email',
  async (injector) => {
    const emailsService = await injector.inject(EmailsService)

    return async (job) => {
      await emailsService.sendFromJobData(job.data)
    }
  }
)
