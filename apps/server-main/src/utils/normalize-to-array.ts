export function normalizeToArray<T>(value: T | T[] | undefined): T[] | undefined
export function normalizeToArray<T>(value: T | T[]): T[]

export function normalizeToArray<T>(
  value: T | T[] | undefined
): T[] | undefined {
  if (!value) {
    return undefined
  }

  return Array.isArray(value) ? value : [value]
}
