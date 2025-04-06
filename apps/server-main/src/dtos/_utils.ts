/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { PaginationMeta } from 'src/interfaces/pagination-meta.interface'
import { ZodType, z } from 'zod'

export const defineDto = <TSchema extends ZodType, TParams extends any[]>(
  schema: TSchema,
  responseFactory: (...params: TParams) => z.infer<typeof schema>
) => {
  return Object.assign(responseFactory, {
    schema,
  })
}

export const definePaginatedDto = <TSchema extends ZodType, TInput>(
  instanceSchema: TSchema,
  instanceFactory: (input: TInput) => z.infer<typeof instanceSchema>
) => {
  const fullSchema = z.object({
    meta: paginationResponseMetaSchema,
    data: z.array(instanceSchema),
  })

  const responseFactory = (input: TInput[], paginationMeta: PaginationMeta) => {
    return {
      meta: paginationMeta,
      data: input.map((item) => instanceFactory(item)),
    }
  }

  return defineDto(fullSchema, responseFactory)
}

export const paginationResponseMetaSchema = z.object({
  total: z.number(),
})

export const paginationDataSchema = z.object({
  limit: z.coerce.number().int().positive(),
  offset: z.coerce.number().int().nonnegative().default(0),
})

export const URL_OPENAPI_EXAMPLE = 'https://example.com'
