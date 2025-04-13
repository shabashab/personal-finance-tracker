import { accounts, currencies, UserId } from '@database/schema'
import { defineRepository } from './_utils'
import { eq } from 'drizzle-orm'
import { AccountCreateData } from '@interfaces/accounts/account-create-data.interface'

export const AccountsRepository = defineRepository(async (db) => {
  const findAllAccountsWithCurrencyByUserId = async (userId: UserId) => {
    return await db
      .select()
      .from(accounts)
      .innerJoin(currencies, eq(currencies.id, accounts.currencyId))
      .where(eq(accounts.userId, userId))
  }

  const createAccount = async (accountData: AccountCreateData) => {
    const [inserted] = await db
      .insert(accounts)
      .values({
        userId: accountData.userId,
        name: accountData.name,
        integration: accountData.integration,
        currencyId: accountData.currencyId,
      })
      .returning()

    if (!inserted) {
      throw new Error('Failed to create account')
    }

    return inserted
  }

  return {
    findAllAccountsWithCurrencyByUserId,
    createAccount,
  }
}, 'AccountsRepository')
