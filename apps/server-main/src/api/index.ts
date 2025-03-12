import { createModule } from '@mikrokit/di'
import { Server } from './server'
import { controllersModule } from './controllers'
import { hooksModule } from './hooks'
import { HttpExceptionErrorHandler } from './core/http-exception.error-handler'
import { ZodSchemaCompiler } from './core/zod.schema-compiler'
import { ZodSerializerCompiler } from './core/zod.serializer-compiler'
import { SwaggerPlugin } from './plugins/swagger.plugin'
import { BullBoardPlugin } from './plugins/bull-board.plugin'

export const apiModule = createModule()
  .import(controllersModule)
  .import(hooksModule)
  .provide(HttpExceptionErrorHandler)
  .provide(ZodSchemaCompiler)
  .provide(ZodSerializerCompiler)
  .provide(SwaggerPlugin)
  .provide(BullBoardPlugin)
  .provide(Server)
