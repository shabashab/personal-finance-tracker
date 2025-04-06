/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifySchemaCompiler } from 'fastify'
import { ZodSchema } from 'zod'
import { UnprocessableEntityException } from '../exceptions/unprocessable-entity.exception'
import { defineProvider } from '@mikrokit/di'

export const ZodSchemaCompiler = defineProvider(
  async (injector): Promise<FastifySchemaCompiler<ZodSchema>> => {
    return ({ schema }: { schema: ZodSchema }) => {
      return (data) => {
        const result = schema.safeParse(data)
        if (result.success) {
          return {
            value: result.data,
          }
        } else {
          throw new UnprocessableEntityException(result.error.errors)
        }
      }
    }
  }
)
