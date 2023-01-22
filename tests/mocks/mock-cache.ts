import { vi } from "vitest";

import { CacheStore } from "@/data/protocols/cache";
import { SavePurchases } from "@/domain/use-cases";

export class CacheStoreSpy implements CacheStore {
  messages: CacheStoreSpy.Message[] = [];
  deleteKey = "";
  insertKey = "";
  insertValues: SavePurchases.Params[] = [];

  delete(key: string): void {
    this.messages.push(CacheStoreSpy.Message.delete);
    this.deleteKey = key;
  }

  insert(key: string, value: any): void {
    this.messages.push(CacheStoreSpy.Message.insert);
    this.insertKey = key;
    this.insertValues = value;
  }

  simulateDeleteError() {
    vi.spyOn(CacheStoreSpy.prototype, "delete").mockImplementationOnce(() => {
      this.messages.push(CacheStoreSpy.Message.delete);
      throw new Error();
    });
  }

  simulateInsertError() {
    vi.spyOn(CacheStoreSpy.prototype, "insert").mockImplementationOnce(() => {
      this.messages.push(CacheStoreSpy.Message.insert);
      throw new Error();
    });
  }
}

export namespace CacheStoreSpy {
  export enum Message {
    delete,
    insert,
  }
}
