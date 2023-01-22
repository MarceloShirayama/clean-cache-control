export interface CacheStore {
  deleteCallsCount: number;
  insertCallsCount: number;
  deleteKey: string;
  insertKey: string;
  delete(key: string): void;
  insert(key: string): void;
}
