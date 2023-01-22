export interface CacheStore {
  deleteKey: string;
  insertKey: string;
  fetchKey: string;
  insertValues: any[];
  fetchResult: any;
  actions: any[];
  fetch(key: string): any;
  delete(key: string): void;
  insert(key: string, value: any): void;
  replace(key: string, value: any): void;
}
