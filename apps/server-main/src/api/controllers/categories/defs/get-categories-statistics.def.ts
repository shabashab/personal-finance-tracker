import { defineDto } from '@dtos/_utils'
import { categoryDto } from '@dtos/category.dto'
import { CategoriesStatisticsPart } from '@interfaces/categories/categories-statistics-part.interface'
import { z } from 'zod'

export const getCategoriesStatisticsRequestQuerySchema = z.object({
  currencyId: z.string().uuid(),
})

const categoriesStatisticsPartDto = defineDto(
  z.object({
    period: z.object({
      from: z.string().datetime(),
      to: z.string().datetime(),
    }),
    data: z
      .object({
        category: categoryDto.schema,
        total: z.number(),
      })
      .array(),
  }),
  (data: CategoriesStatisticsPart) => {
    return {
      period: {
        from: data.period.from.toISOString(),
        to: data.period.to.toISOString(),
      },
      data: data.data.map((item) => ({
        category: categoryDto(item.category),
        total: Number.parseFloat(item.total),
      })),
    }
  }
)

export const getCategoriesStatisticsResponseDto = defineDto(
  z.object({
    incomes: categoriesStatisticsPartDto.schema.array(),
    expenses: categoriesStatisticsPartDto.schema.array(),
  }),
  (
    incomeStatisticsPart: CategoriesStatisticsPart[],
    expensesStatisticsPart: CategoriesStatisticsPart[]
  ) => {
    return {
      incomes: incomeStatisticsPart.map((item) =>
        categoriesStatisticsPartDto(item)
      ),
      expenses: expensesStatisticsPart.map((item) =>
        categoriesStatisticsPartDto(item)
      ),
    }
  }
)
