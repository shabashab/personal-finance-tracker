import { type Storage } from './storage.interface'

export const createStorageLocalStorage = (key: string): Storage<string> => {
  return {
    get: () => localStorage.getItem(key),
    remove: () => localStorage.removeItem(key),
    set: (val) => localStorage.setItem(key, val),
  }
}
