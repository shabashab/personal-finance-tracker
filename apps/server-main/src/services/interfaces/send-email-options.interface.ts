export interface SendEmailOptions {
  /**
   * Specifies the type of mail content
   * @default 'html'
   */
  contentType?: 'html' | 'plain'

  /**
   * Mail subject
   */
  subject?: string

  /**
   * Mail sender (will overwrite default environment sender)
   */
  from?: string
}
