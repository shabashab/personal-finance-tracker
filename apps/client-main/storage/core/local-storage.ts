import { type Storage } from './storage.interface'

export const createStorageLocalStorage = (key: string): Storage<string> => {
  return {
    get: () => localStorage.getItem(key),
    remove: () => {
      localStorage.removeItem(key)
    },
    set: (value) => {
      localStorage.setItem(key, value)
    },
  }
}
