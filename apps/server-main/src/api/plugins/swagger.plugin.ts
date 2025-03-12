import swagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { FastifyInstance } from 'fastify'
import {
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  fastifyZodOpenApiPlugin,
} from 'fastify-zod-openapi'
import { ZodOpenApiVersion } from 'zod-openapi'
import fastifyPlugin from 'fastify-plugin'
import { defineProvider } from '@mikrokit/di'

export const SwaggerPlugin = defineProvider(async () => {
  return fastifyPlugin(async (fastify: FastifyInstance) => {
    await fastify.register(fastifyZodOpenApiPlugin)

    await fastify.register(swagger, {
      openapi: {
        info: {
          title: 'hello world',
          version: '1.0.0',
        },
        openapi: '3.0.3' satisfies ZodOpenApiVersion,
        components: {
          securitySchemes: {
            bearerToken: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },

      transform: fastifyZodOpenApiTransform,
      transformObject: fastifyZodOpenApiTransformObject,
    })

    await fastify.register(fastifySwaggerUi)
  })
})
