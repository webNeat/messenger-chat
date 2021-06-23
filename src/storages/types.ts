export interface ContextStorage {
  set(key: string, value: string): Promise<void>
  get(key: string): Promise<string | undefined>
  delete(key: string): Promise<void>
}
