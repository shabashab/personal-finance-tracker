/* eslint-disable @typescript-eslint/no-dynamic-delete */
// Removes all object entries that have value of null or undefined
export const removeEmptyObjectEntries = (
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  input: Record<string, unknown | undefined | null>
) => {
  const result = { ...input }

  for (const key in result) {
    if (!(key in result)) {
      continue
    }

    if (
      input[key] === undefined ||
      (typeof input[key] === 'object' && input[key] === null) ||
      (typeof input[key] === 'string' && input[key] === '')
    ) {
      delete result[key]
    }
  }

  return result
}
