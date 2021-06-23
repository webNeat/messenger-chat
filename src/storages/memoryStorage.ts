import {ContextStorage} from './types'

export function memoryStorage(): ContextStorage {
  const storage = {} as Record<string, string>
  const get = async (key: string) => storage[key]
  const set = async (key: string, value: string) => {
    storage[key] = value
  }
  const remove = async (key: string) => {
    delete storage[key]
  }
  return {get, set, delete: remove}
}
