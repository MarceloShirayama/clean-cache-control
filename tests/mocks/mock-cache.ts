import { vi } from "vitest";

import { CacheStore } from "@/data/protocols/cache";
import { SavePurchases } from "@/domain/use-cases";

export class CacheStoreSpy implements CacheStore {
  actions: CacheStoreSpy.Action[] = [];
  deleteKey = "";
  insertKey = "";
  insertValues: SavePurchases.Params[] = [];

  delete(key: string): void {
    this.actions.push(CacheStoreSpy.Action.delete);
    this.deleteKey = key;
  }

  insert(key: string, value: any): void {
    this.actions.push(CacheStoreSpy.Action.insert);
    this.insertKey = key;
    this.insertValues = value;
  }

  simulateDeleteError() {
    vi.spyOn(CacheStoreSpy.prototype, "delete").mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.delete);
      throw new Error();
    });
  }

  simulateInsertError() {
    vi.spyOn(CacheStoreSpy.prototype, "insert").mockImplementationOnce(() => {
      this.actions.push(CacheStoreSpy.Action.insert);
      throw new Error();
    });
  }
}

export namespace CacheStoreSpy {
  export enum Action {
    delete,
    insert,
  }
}
