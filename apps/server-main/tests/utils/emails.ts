import { Container } from '@mikrokit/di'
import { Transporter } from '@core/transporter'
import { NodemailerMockTransporter } from 'nodemailer-mock'
import Mail from 'nodemailer/lib/mailer'

export const getSentEmailsByUserEmail = async (
  constainer: Container,
  email: string
) => {
  const transporter = (await constainer.inject(
    Transporter
  )) as NodemailerMockTransporter

  const mock = transporter.nodemailermock.mock

  const sentEmail = mock.getSentMail()

  const filteredEmails = sentEmail.filter((sentEmail) => {
    if (typeof sentEmail.to === 'string') {
      return sentEmail.to.includes(email)
    } else if (Array.isArray(sentEmail.to)) {
      return sentEmail.to.some(
        (to) => typeof to === 'string' && to.includes(email)
      )
    }
    return false
  })

  return filteredEmails
}

export const getTokenFromEmail = (email: Mail.Options): string | undefined => {
  if (email.html && typeof email.html === 'string') {
    const token = getUuidFromStringUsingRegex(email.html)
    if (token) return token
  }

  if (email.text && typeof email.text === 'string') {
    return getUuidFromStringUsingRegex(email.text)
  }

  return undefined
}

const getUuidFromStringUsingRegex = (text: string): string | undefined => {
  const regex =
    /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/

  const match = regex.exec(text)
  return match ? match[0] : undefined
}
