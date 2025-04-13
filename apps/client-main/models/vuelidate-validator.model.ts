import type { ErrorObject } from '@vuelidate/core'

export interface VuelidateValidator {
  $error: boolean
  $errors: ErrorObject[]
}
