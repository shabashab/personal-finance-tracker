import { Database } from '@database/drizzle'
import { currencies, UserId } from '@database/schema'
import { Container } from '@mikrokit/di'

export const createCurrency = async (
  container: Container,
  name: string,
  usdExchangeRate: number,
  userId?: UserId
) => {
  const db = await container.inject(Database)

  const [inserted] = await db
    .insert(currencies)
    .values({
      name,
      usdExchangeRate: `${usdExchangeRate}`,
      userId,
    })
    .returning()

  return inserted
}
