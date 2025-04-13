import { categories, CategoryKind, UserId } from '@database/schema'
import { defineRepository } from './_utils'
import { and, eq } from 'drizzle-orm'
import { ConflictException } from '@api/exceptions/conflict.exception'

export const CategoriesRepository = defineRepository(async (db) => {
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

  return {
    createCategory,
    findCategoriesByUserId,
  }
}, 'CategoriesRepository')
