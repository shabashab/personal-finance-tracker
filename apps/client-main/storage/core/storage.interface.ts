export interface Storage<T> {
  get(): T | null
  set(value: T): void
  remove(): void
}
