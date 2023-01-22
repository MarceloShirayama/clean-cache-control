export interface CacheStore {
  deleteKey: string;
  insertKey: string;
  insertValues: any[];
  actions: any[];
  delete(key: string): void;
  insert(key: string, value: any): void;
  replace(key: string, value: any): void;
}
