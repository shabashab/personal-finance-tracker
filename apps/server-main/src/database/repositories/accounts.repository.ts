import { AccountId, accounts, currencies, UserId } from '@database/schema'
import { defineRepository } from './_utils'
import { eq, sql } from 'drizzle-orm'
import { AccountCreateData } from '@interfaces/accounts/account-create-data.interface'

export const AccountsRepository = defineRepository(async (db) => {
  const findAccountById = async (accountId: AccountId) => {
    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId))

    return account
  }

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
        initialBalance: `${accountData.initialBalance ?? 0}`,
        integration: accountData.integration,
        currencyId: accountData.currencyId,
      })
      .returning()

    if (!inserted) {
      throw new Error('Failed to create account')
    }

    return inserted
  }

  const findAccountByMonobankAccountId = async (monobankAccountId: string) => {
    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(sql`accounts.integration->>'accountId'`, monobankAccountId))

    return account
  }

  return {
    findAllAccountsWithCurrencyByUserId,
    findAccountById,
    createAccount,
    findAccountByMonobankAccountId,
  }
}, 'AccountsRepository')
