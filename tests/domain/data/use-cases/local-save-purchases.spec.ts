import { describe, expect, it } from "vitest";

interface CacheStore {}

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;
}

class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {}
}

describe("LocalSavePurchases", () => {
  it("Should not delete cache on sut.init", () => {
    const cacheStore = new CacheStoreSpy();
    const sut = new LocalSavePurchases(cacheStore);

    expect(cacheStore.deleteCallsCount).toBe(0);
  });
});
