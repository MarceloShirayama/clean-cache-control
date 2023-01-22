export interface CacheStore {
  deleteCallsCount: number;
  insertCallsCount: number;
  deleteKey: string;
  insertKey: string;
  insertValues: any[];
  delete(key: string): void;
  insert(key: string, value: any): void;
}
