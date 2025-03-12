import 'zod-openapi/extend'
import { defineProvider } from '@mikrokit/di'
import Fastify from 'fastify'

import { Logger } from '@core/logger'
import { Controller } from './controllers/_utils'
import { ZodSchemaCompiler } from './core/zod.schema-compiler'
import { ZodSerializerCompiler } from './core/zod.serializer-compiler'
import { HttpExceptionErrorHandler } from './core/http-exception.error-handler'
import { SwaggerPlugin } from './plugins/swagger.plugin'
import {
  BULL_BOARD_BASE_PATH,
  BullBoardPlugin,
} from './plugins/bull-board.plugin'
import { UserSelect } from '@database/schema'

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserSelect | null
  }
}

export const Server = defineProvider(async (injector) => {
  const logger = await injector.inject(Logger)

  const zodSchemaCompiler = await injector.inject(ZodSchemaCompiler)
  const zodSerializerCompiler = await injector.inject(ZodSerializerCompiler)
  const httpExceptionErrorHandler = await injector.inject(
    HttpExceptionErrorHandler
  )

  const swaggerPlugin = await injector.inject(SwaggerPlugin)
  const bullBoardPlugin = await injector.inject(BullBoardPlugin)

  const controllers = await injector.inject(Controller)

  const fastify = await Fastify({
    loggerInstance: logger,
  })

  fastify.setValidatorCompiler(zodSchemaCompiler)
  fastify.setSerializerCompiler(zodSerializerCompiler)
  fastify.setErrorHandler(httpExceptionErrorHandler)

  await fastify.register(swaggerPlugin)
  await fastify.register(bullBoardPlugin, {
    prefix: BULL_BOARD_BASE_PATH,
    basePath: BULL_BOARD_BASE_PATH,
  })

  for (const controller of controllers) {
    await fastify.register(controller.plugin, { prefix: controller.prefix })
  }

  await fastify.ready()

  return fastify
})
