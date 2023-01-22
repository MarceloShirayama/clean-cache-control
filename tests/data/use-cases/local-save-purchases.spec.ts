import { describe, expect, it } from "vitest";

import { LocalSavePurchases } from "@/data/use-cases";
import { CacheStoreSpy, mockPurchases } from "tests/mocks";

type SutTypes = {
  sut: LocalSavePurchases;
  cacheStore: CacheStoreSpy;
};

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore);

  return { cacheStore, sut };
};

describe("LocalSavePurchases", () => {
  it("Should not delete cache on sut.init", () => {
    const { cacheStore } = makeSut();

    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  it("Should delete old cache on sut.save", async () => {
    const { sut, cacheStore } = makeSut();

    await sut.save(mockPurchases());

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deleteKey).toBe("purchases");
  });

  it("Should not insert new cache if delete fails", () => {
    const { sut, cacheStore } = makeSut();

    cacheStore.simulateDeleteError();

    const promise = sut.save(mockPurchases());

    expect(promise).rejects.toThrow();

    expect(cacheStore.insertCallsCount).toBe(0);
  });

  it("Should insert new cache if delete success", async () => {
    const { sut, cacheStore } = makeSut();

    const purchases = mockPurchases();

    await sut.save(purchases);

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.insertCallsCount).toBe(1);
    expect(cacheStore.insertValues).toEqual(purchases);
  });

  it("Should throw if insert throws", async () => {
    const { sut, cacheStore } = makeSut();

    cacheStore.simulateInsertError();

    const promise = sut.save(mockPurchases());

    expect(promise).rejects.toThrow();
  });
});
