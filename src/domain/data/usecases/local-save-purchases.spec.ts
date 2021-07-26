class LocalSavePurchases {
  constructor (private readonly cacheStore: CacheStore) {}
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CacheStore {}

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
}

describe('LocalSavePurchases', () => {
  it('Should not delete cache on sut.init', () => {
    const cacheStore = new CacheStoreSpy()
    // eslint-disable-next-line no-new
    new LocalSavePurchases(cacheStore)
    expect(cacheStore.deleteCallsCount).toBe(0)
  })
})
