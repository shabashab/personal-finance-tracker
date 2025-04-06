/* eslint-disable @typescript-eslint/no-explicit-any */
import { Uuid } from '@utils'
import { timestamp, uuid } from 'drizzle-orm/pg-core'

export const timestamps = {
  createdAt: timestamp({
    mode: 'date',
    precision: 3,
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp({
    mode: 'date',
    precision: 3,
    withTimezone: true,
  })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}

export const brandedUuid = <Brand extends Uuid<any>>() => uuid().$type<Brand>()
export const primaryUuid = <Brand extends Uuid<any>>() =>
  brandedUuid<Brand>().primaryKey().defaultRandom().notNull()
