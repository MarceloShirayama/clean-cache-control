export interface CacheStore {
  deleteKey: string;
  insertKey: string;
  insertValues: any[];
  messages: any[];
  delete(key: string): void;
  insert(key: string, value: any): void;
}
