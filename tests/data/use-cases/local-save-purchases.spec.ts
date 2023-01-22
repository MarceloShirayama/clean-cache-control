import { describe, expect, it, vi } from "vitest";

import { CacheStore } from "@/data/protocols/cache";
import { LocalSavePurchases } from "@/data/use-cases";

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0;
  insertCallsCount = 0;
  deleteKey = "";
  insertKey = "";

  delete(key: string): void {
    this.deleteCallsCount++;
    this.deleteKey = key;
  }

  insert(key: string): void {
    this.insertCallsCount++;
    this.insertKey = key;
  }
}

type SutTypes = {
  sut: LocalSavePurchases;
  cacheStore: CacheStore;
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

    await sut.save();

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deleteKey).toBe("purchases");
  });

  it("Should not insert new cache if delete fails", () => {
    const { sut, cacheStore } = makeSut();

    vi.spyOn(cacheStore, "delete").mockImplementationOnce(() => {
      throw new Error();
    });

    const promise = sut.save();

    expect(promise).rejects.toThrow();

    expect(cacheStore.insertCallsCount).toBe(0);
  });

  it("Should insert new cache if delete success", async () => {
    const { sut, cacheStore } = makeSut();

    await sut.save();

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.insertCallsCount).toBe(1);
    expect(cacheStore.insertKey).toBe("purchases");
  });
});
