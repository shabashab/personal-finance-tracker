/**
 * Mutates the original object and removes all undefined fields
 * @param obj Object
 * @returns Input object
 */
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  Object.keys(obj).forEach((key) =>
    obj[key] === undefined ? delete obj[key] : {}
  )

  return obj
}
