import { describe, expect, it } from "vitest";

import { LocalLoadPurchases } from "@/data/use-cases";
import {
  CacheStoreSpy,
  getCacheExpirationDate,
  mockPurchases,
} from "tests/mocks";
import { config } from "@/config";

type SutTypes = {
  sut: LocalLoadPurchases;
  cacheStore: CacheStoreSpy;
};

const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalLoadPurchases(cacheStore, timestamp);

  return { cacheStore, sut };
};

describe("LocalLoadPurchases", () => {
  it("Should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();

    expect(cacheStore.actions).toEqual([]);
  });

  it("Should return empty list if load fails", async () => {
    const { cacheStore, sut } = makeSut();

    cacheStore.simulateFetchError();

    const purchases = await sut.loadAll();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(purchases).toEqual([]);
  });

  it(`Should return a list of purchases if cache is less than 
    ${config.cacheExpirationInDays} days old`, async () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(timestamp.getSeconds() + 1);

    const { cacheStore, sut } = makeSut(currentDate);

    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };

    const purchases = await sut.loadAll();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(purchases).toEqual(cacheStore.fetchResult.value);
  });

  it(`Should return an empty list if cache is more than 
    ${config.cacheExpirationInDays} days old`, async () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(timestamp.getSeconds() - 1);

    const { cacheStore, sut } = makeSut(currentDate);

    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };

    const purchases = await sut.loadAll();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(purchases).toEqual([]);
  });

  it(`Should return an empty list if cache is 
    ${config.cacheExpirationInDays} days old`, async () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);

    const { cacheStore, sut } = makeSut(currentDate);

    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };

    const purchases = await sut.loadAll();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(purchases).toEqual([]);
  });

  it("Should return an empty list if cache is empty", async () => {
    const currentDate = new Date();
    const timestamp = new Date(currentDate);

    timestamp.setDate(timestamp.getDate() - 3);
    timestamp.setSeconds(timestamp.getSeconds() + 1);

    const { cacheStore, sut } = makeSut(currentDate);

    cacheStore.fetchResult = {
      timestamp,
      value: [],
    };

    const purchases = await sut.loadAll();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(purchases).toEqual([]);
  });
});
