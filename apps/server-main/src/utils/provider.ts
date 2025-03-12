import { ProviderFactory } from '@mikrokit/di'

export type InferProviderReturnType<T> =
  T extends ProviderFactory<infer R> ? R : never
