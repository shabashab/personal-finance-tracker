import {
  categories,
  CategoryId,
  CategoryKind,
  transactions,
  UserId,
} from '@database/schema'
import { defineRepository } from './_utils'
import { and, eq, gte, isNull, lte, or, sql } from 'drizzle-orm'
import { ConflictException } from '@api/exceptions/conflict.exception'
import { CategoriesStatisticsPart } from '@interfaces/categories/categories-statistics-part.interface'

export const CategoriesRepository = defineRepository(async (db) => {
  const findDefaultCategoryByUserIdAndKind = async (
    userId: UserId,
    categoryKind: CategoryKind
  ) => {
    const category = await db.query.categories.findFirst({
      where: and(
        eq(categories.userId, userId),
        eq(categories.kind, categoryKind),
        eq(categories.isDefault, true)
      ),
    })

    return category
  }

  const findCategoryById = async (categoryId: CategoryId) => {
    return await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    })
  }

  const findCategoriesByUserId = async (userId: UserId) => {
    const selectedCategories = await db.query.categories.findMany({
      where: eq(categories.userId, userId),
    })

    return selectedCategories
  }

  const createCategory = async (
    userId: UserId,
    name: string,
    kind: CategoryKind,
    isDefault: boolean
  ) => {
    const existingNameCategory = await findUserCategoryByName(userId, name)

    if (existingNameCategory) {
      throw new ConflictException(
        'Category with this name already exists for user'
      )
    }

    if (isDefault) {
      const existingDefaultCategory = await findUserDefaultCategoryByKind(
        userId,
        kind
      )

      if (existingDefaultCategory) {
        throw new ConflictException(
          'Default category already exists for this kind'
        )
      }
    }

    const [inserted] = await db
      .insert(categories)
      .values({
        userId,
        name,
        kind,
        isDefault,
      })
      .returning()

    if (!inserted) {
      throw new Error('Category creation failed')
    }

    return inserted
  }

  const findUserCategoryByName = async (userId: UserId, name: string) => {
    const category = await db.query.categories.findFirst({
      where: and(eq(categories.name, name), eq(categories.userId, userId)),
    })

    return category
  }

  const findUserDefaultCategoryByKind = async (
    userId: UserId,
    kind: CategoryKind
  ) => {
    const category = await db.query.categories.findFirst({
      where: and(
        eq(categories.kind, kind),
        eq(categories.userId, userId),
        eq(categories.isDefault, true)
      ),
    })

    return category
  }

  const findUserCategoryStatisticsByKindAndTimePeriod = async (
    userId: UserId,
    kind: CategoryKind,
    targetCurrencyExchangeRateUsd: string,
    period: {
      from: Date
      to: Date
    }
  ): Promise<CategoriesStatisticsPart> => {
    const result = await db
      .select({
        categoryId: categories.id,
        total: sql<string>`
          COALESCE(
            SUM(${transactions.amount} * (${targetCurrencyExchangeRateUsd} / ${transactions.currencyUsdExchangeRate})),
            0
          )
          `.as('total'),
      })
      .from(categories)
      .leftJoin(transactions, eq(categories.id, transactions.categoryId))
      .where(
        and(
          eq(categories.kind, kind),
          eq(categories.userId, userId),
          or(
            isNull(transactions),
            and(
              gte(transactions.performedAt, period.from),
              lte(transactions.performedAt, period.to)
            )
          )
        )
      )
      .groupBy(categories.id)

    const selectedCategories = await db.query.categories.findMany({
      where: and(eq(categories.userId, userId), eq(categories.kind, kind)),
    })

    return {
      period,
      data: result.map((item) => {
        const category = selectedCategories.find(
          (category) => category.id === item.categoryId
        )

        if (!category) {
          throw new Error('Category not found')
        }

        return {
          category,
          total: item.total,
        }
      }),
    }
  }

  return {
    createCategory,
    findCategoriesByUserId,
    findDefaultCategoryByUserIdAndKind,
    findCategoryById,
    findUserCategoryStatisticsByKindAndTimePeriod,
  }
}, 'CategoriesRepository')
