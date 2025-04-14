import { MonobankWebhookData } from '@interfaces/integrations/monobank-webhook-data.interface'
import { defineProvider } from '@mikrokit/di'
import { AccountsService } from './accounts.service'
import { NotFoundException } from '@api/exceptions/not-found.exception'
import { TransactionsService } from './transactions.service'

export const MonobankWebhookService = defineProvider(async (injector) => {
  const accountsService = await injector.inject(AccountsService)
  const transactionsService = await injector.inject(TransactionsService)

  const handleMonobankWebhook = async (data: object) => {
    if (!isStatementItemWebhook(data)) {
      throw new Error('Unknown webhook data')
    }

    const account = await accountsService.findAccountByMonobankAccountId(
      data.data.account
    )

    if (!account) {
      throw new NotFoundException(
        'Account with received monobank account id not found'
      )
    }

    return await transactionsService.createTransaction({
      accountId: account.id,
      amount: Math.abs(data.data.statementItem.amount / 100),
      kind: data.data.statementItem.amount < 0 ? 'EXPENSE' : 'INCOME',
      performedAt: new Date(data.data.statementItem.time),
    })
  }

  const isStatementItemWebhook = (
    data: object
  ): data is MonobankWebhookData => {
    return (
      typeof data === 'object' &&
      'type' in data &&
      data.type === 'StatementItem'
    )
  }

  return {
    handleMonobankWebhook,
  }
}, 'MonobankWebhookService')
