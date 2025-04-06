/* eslint-disable @typescript-eslint/no-unused-vars */
import { FastifySerializerCompiler } from 'fastify/types/schema'
import { UnprocessableEntityException } from '../exceptions/unprocessable-entity.exception'
import { ZodSchema } from 'zod'
import { defineProvider } from '@mikrokit/di'

export const ZodSerializerCompiler = defineProvider(
  async (injector): Promise<FastifySerializerCompiler<ZodSchema>> => {
    return ({ schema }: { schema: ZodSchema }) => {
      return (data) => {
        const result = schema.safeParse(data)

        if (result.success) {
          return JSON.stringify(result.data)
        }

        throw new UnprocessableEntityException(result)
      }
    }
  }
)
