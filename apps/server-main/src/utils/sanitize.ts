/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-unused-expressions */

/**
 * Mutates the original object and removes all undefined fields
 * @param obj Object
 * @returns Input object
 */
export const sanitizeObject = <T extends Record<string, any>>(object: T): T => {
  for (const key of Object.keys(object))
    object[key] === undefined ? delete object[key] : {}

  return object
}
