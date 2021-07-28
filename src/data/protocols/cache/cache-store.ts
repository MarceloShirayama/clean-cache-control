// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CacheStore {
  delete: (key: string) => void
  insert: (key: string, value: any) => void
}
