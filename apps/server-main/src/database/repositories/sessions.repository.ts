import { users, UserId, sessions, SessionId } from '@database/schema'
import { defineRepository } from './_utils'
import { and, eq, gt, desc, sql } from 'drizzle-orm'

export const SessionsRepository = defineRepository(async (db) => {
  const findUserAndSessionByActiveSessionId = async (id: SessionId) => {
    const [result] = await db
      .select()
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(and(eq(sessions.id, id), gt(sessions.expiresAt, new Date())))
      .limit(1)

    if (!result) {
      return
    }

    return {
      user: result.users,
      session: result.sessions,
    }
  }

  const findActiveSessionByUserId = async (userId: UserId) => {
    const [result] = await db
      .select()
      .from(sessions)
      .innerJoin(users, eq(users.id, sessions.userId))
      .where(
        and(eq(sessions.userId, userId), gt(sessions.expiresAt, new Date()))
      )
      .orderBy(desc(sessions.createdAt))
      .limit(1)

    return result?.sessions
  }

  const createSessionForUserById = async (userId: UserId) => {
    const [result] = await db
      .insert(sessions)
      .values({
        userId,
      })
      .returning()

    if (!result) {
      throw new Error('Failed to create session')
    }

    return result
  }

  const extendSessionByOneDayById = async (id: SessionId) => {
    await db
      .update(sessions)
      .set({
        expiresAt: sql`now() + interval '1 day'`,
      })
      .where(
        and(
          eq(sessions.id, id),
          gt(sql`now() - interval '5 seconds'`, sessions.updatedAt)
        )
      )
  }

  return {
    findUserAndSessionByActiveSessionId,
    findActiveSessionByUserId,
    createSessionForUserById,
    extendSessionByOneDayById,
  }
}, 'SessionsRepository')
