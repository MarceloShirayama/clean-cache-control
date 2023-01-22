export interface CacheStore {
  deleteKey: string;
  insertKey: string;
  fetchKey: string;
  insertValues: any[];
  actions: any[];
  fetch(key: string): void;
  delete(key: string): void;
  insert(key: string, value: any): void;
  replace(key: string, value: any): void;
}
