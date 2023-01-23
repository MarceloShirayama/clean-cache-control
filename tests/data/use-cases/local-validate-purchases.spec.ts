import { describe, expect, it } from "vitest";

import { LocalLoadPurchases } from "@/data/use-cases";
import {
  CacheStoreSpy,
  getCacheExpirationDate,
  mockPurchases,
} from "tests/mocks";

type SutTypes = {
  sut: LocalLoadPurchases;
  cacheStore: CacheStoreSpy;
};

const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalLoadPurchases(cacheStore, timestamp);

  return { cacheStore, sut };
};

describe("LocalValidatePurchases", () => {
  it("Should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();

    expect(cacheStore.actions).toEqual([]);
  });

  it("Should delete cache if load fails", () => {
    const { cacheStore, sut } = makeSut();

    cacheStore.simulateFetchError();

    sut.validate();

    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ]);
    expect(cacheStore.deleteKey).toBe("purchases");
  });

  it(`Should has no side effects if load succeeds`, () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(timestamp.getSeconds() + 1);

    const { cacheStore, sut } = makeSut(currentDate);

    cacheStore.fetchResult = { timestamp };

    sut.validate();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe("purchases");
  });

  it(`Should delete cache if cache expired`, () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(timestamp.getSeconds() - 1);

    const { cacheStore, sut } = makeSut(currentDate);

    cacheStore.fetchResult = { timestamp };

    sut.validate();

    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(cacheStore.deleteKey).toBe("purchases");
  });

  it(`Should delete cache if cache on expiration date`, () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);

    const { cacheStore, sut } = makeSut(currentDate);

    cacheStore.fetchResult = { timestamp };

    sut.validate();

    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(cacheStore.deleteKey).toBe("purchases");
  });
});
