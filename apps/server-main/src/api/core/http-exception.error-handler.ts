import { FastifyReply, FastifyRequest } from 'fastify'
import { defineProvider } from '@mikrokit/di'
import { Logger } from '@core/logger'
import { HttpException } from '../exceptions/http-exception'

export const HttpExceptionErrorHandler = defineProvider(async (injector) => {
  const logger = await injector.inject(Logger)

  return async (
    error: HttpException,
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    if ('status' in error) {
      return await reply.status(error.status).send({
        status: error.status,
        message: error.message,
        details: error.details,
      })
    } else {
      logger.error(error)

      // const response = {
      //   status: reply.statusCode,
      //   error: {
      //     status: (error as any).status,
      //     stack: (error as any).stack,
      //     message: (error as any).message,
      //     details: (error as any).details,
      //   },
      //   message: `${reply.statusCode} - ${request.url}`,
      //   user: request.user,
      //   headers: request.headers,
      //   query: request.query,
      //   body: request.body,
      // }

      return await reply.status(500).send({
        status: 500,
        message: 'Internal Server Error',
      })
    }
  }
})
