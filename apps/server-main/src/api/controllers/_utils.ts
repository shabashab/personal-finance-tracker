/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRole, UserSelect } from '@database/schema'
import {
  Injector,
  createGroupProviderToken,
  defineProvider,
} from '@mikrokit/di'
import {
  FastifyInstance,
  FastifyPluginAsync,
  HTTPMethods,
  RouteOptions,
} from 'fastify'
import { ZodType, ZodTypeAny, z } from 'zod'
import { RequireAuthHook } from '../hooks/require-auth.hook'
import { sanitizeObject } from '@utils'
import '@fastify/swagger'

export interface ControllerDefinition {
  prefix: string
  plugin: FastifyPluginAsync
}

export const Controller = createGroupProviderToken<ControllerDefinition>()

export interface RouteDefinitionFactoryOptions<
  TQuery extends ZodType<any, any, Record<string, any>>,
  TParams extends ZodType<any, any, Record<string, any>>,
  TBody extends ZodTypeAny,
  THeaders extends ZodType<any, any, Record<string, any>>,
  TResponse extends ZodTypeAny,
> {
  hooks?: {
    preHandler?: RouteOptions['preHandler']
    onRequest?: RouteOptions['onRequest']
  }

  docs?: {
    summary?: string
    description?: string
    tags?: [string]
  }

  request?: {
    query?: TQuery
    params?: TParams
    body?: TBody
    headers?: THeaders
  }

  response: TResponse
}

interface ControllerRoutes {
  public: RouteDefinitionFactoryGroup
  auth: RouteDefinitionFactoryGroup<
    { user: UserSelect },
    { roles?: UserRole[] }
  >
}

interface RouteDefinitionFactoryGroup<
  TRequestExtension = {},
  TOptionsExtension = {},
> {
  get: RouteDefinitionFactory<TRequestExtension, TOptionsExtension>
  post: RouteDefinitionFactory<TRequestExtension, TOptionsExtension>
  put: RouteDefinitionFactory<TRequestExtension, TOptionsExtension>
  patch: RouteDefinitionFactory<TRequestExtension, TOptionsExtension>
  delete: RouteDefinitionFactory<TRequestExtension, TOptionsExtension>
}

type RouteDefinitionFactory<TRequestExtension = {}, TOptionsExtension = {}> = <
  TQuery extends ZodType<any, any, Record<string, any>>,
  TParams extends ZodType<any, any, Record<string, any>>,
  TBody extends ZodTypeAny,
  THeaders extends ZodType<any, any, Record<string, any>>,
  TResponse extends ZodTypeAny,
>(
  url: string,
  options: RouteDefinitionFactoryOptions<
    TQuery,
    TParams,
    TBody,
    THeaders,
    TResponse
  > &
    TOptionsExtension,
  handler: (
    request: {
      query: z.infer<TQuery>
      params: z.infer<TParams>
      body: z.infer<TBody>
      headers: z.infer<THeaders>
    } & TRequestExtension
  ) => Promise<z.infer<TResponse>>
) => void

export const defineController = (
  prefix: string,
  factory: (
    route: ControllerRoutes,
    injector: Injector,
    fastify: FastifyInstance
  ) => Promise<void>
) => {
  return defineProvider<ControllerDefinition, typeof Controller>(
    async (injector) => {
      const requireAuthMiddleware = await injector.inject(RequireAuthHook)

      return {
        prefix,
        plugin: async (fastify) => {
          const createPublicRouteFactory = (
            method: HTTPMethods
          ): RouteDefinitionFactory => {
            return (url, options, handler) => {
              fastify.route({
                method,
                url,
                schema: sanitizeObject({
                  tags: options.docs?.tags,
                  description: options.docs?.description,
                  summary: options.docs?.summary,
                  querystring: options.request?.query,
                  params: options.request?.params,
                  body: options.request?.body,
                  headers: options.request?.headers,
                  // Currently we ignore response validation and only use zod schemas for typing
                  response: {
                    '2xx': options.response as any,
                  },
                }),
                onRequest: options.hooks?.onRequest,
                preHandler: options.hooks?.preHandler,
                handler: async (request) => {
                  return await handler(request)
                },
              })
            }
          }

          const createAuthRouteFactory = (
            method: HTTPMethods
          ): RouteDefinitionFactory<
            { user: UserSelect },
            { roles?: UserRole[] }
          > => {
            return (url, options, handler) => {
              fastify.route({
                method,
                url,
                schema: sanitizeObject({
                  security: [{ bearerAuth: [] }],
                  tags: options.docs?.tags,
                  description: options.docs?.description,
                  summary: options.docs?.summary,
                  querystring: options.request?.query,
                  params: options.request?.params,
                  body: options.request?.body,
                  headers: options.request?.headers,
                  // Currently we ignore response validation and only use zod schemas for typing
                  response: {
                    '2xx': options.response as any,
                  },
                  // TODO: add validation of response
                }),
                onRequest: [requireAuthMiddleware()],
                preHandler: options.hooks?.preHandler,
                handler: async (request) => {
                  if (!request.user) {
                    throw new Error('request_user_not_found_in_request_object')
                  }

                  return await handler(
                    request as Omit<typeof request, 'user'> & {
                      user: UserSelect
                    }
                  )
                },
              })
            }
          }

          const routes: ControllerRoutes = {
            public: {
              get: createPublicRouteFactory('GET'),
              post: createPublicRouteFactory('POST'),
              put: createPublicRouteFactory('PUT'),
              patch: createPublicRouteFactory('PATCH'),
              delete: createPublicRouteFactory('DELETE'),
            },
            auth: {
              get: createAuthRouteFactory('GET'),
              post: createAuthRouteFactory('POST'),
              put: createAuthRouteFactory('PUT'),
              patch: createAuthRouteFactory('PATCH'),
              delete: createAuthRouteFactory('DELETE'),
            },
          }

          await factory(routes, injector, fastify)
        },
      }
    },
    Controller
  )
}
