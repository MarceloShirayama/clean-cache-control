import { describe, expect, it } from "vitest";

import { LocalLoadPurchases } from "@/data/use-cases";
import { CacheStoreSpy, mockPurchases } from "tests/mocks";

type SutTypes = {
  sut: LocalLoadPurchases;
  cacheStore: CacheStoreSpy;
};

const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalLoadPurchases(cacheStore, timestamp);

  return { cacheStore, sut };
};

describe("LocalSavePurchases", () => {
  it("Should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();

    expect(cacheStore.actions).toEqual([]);
  });

  it("Should not insert new cache if delete fails", async () => {
    const { sut, cacheStore } = makeSut();

    cacheStore.simulateDeleteError();

    const promise = sut.save(mockPurchases());

    await expect(promise).rejects.toThrow();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete]);
  });

  it("Should insert new cache if delete success", async () => {
    const timestamp = new Date();
    const { sut, cacheStore } = makeSut(timestamp);

    const purchases = mockPurchases();

    const promise = sut.save(purchases);

    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.delete,
      CacheStoreSpy.Action.insert,
    ]);
    expect(cacheStore.deleteKey).toBe("purchases");
    expect(cacheStore.insertKey).toBe("purchases");
    expect(cacheStore.insertValues).toEqual({
      timestamp,
      value: purchases,
    });
    await expect(promise).resolves.toBeFalsy();
  });

  it("Should throw if insert throws", async () => {
    const { sut, cacheStore } = makeSut();

    cacheStore.simulateInsertError();

    const promise = sut.save(mockPurchases());

    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.delete,
      CacheStoreSpy.Action.insert,
    ]);
    await expect(promise).rejects.toThrow();
  });
});
