/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ToastMessageOptions } from 'primevue/toast'
import { removeEmptyObjectEntries } from './remove-empty-object-entries'

export const successToastMessage = (summary: string, detail?: string) => {
  return removeEmptyObjectEntries({
    severity: 'success',
    summary,
    detail,
    life: 3000,
  })
}

export const apiErrorMessage = (error: any) => {
  return removeEmptyObjectEntries({
    severity: 'error',
    summary: error?.message,
    detail: error?.data?.message,
    life: 5000,
  })
}

export const errorToastMessage = (
  errorMessage: string
): ToastMessageOptions => {
  return removeEmptyObjectEntries({
    severity: 'error',
    summary: 'Error',
    detail: errorMessage,
    life: 5000,
  })
}
