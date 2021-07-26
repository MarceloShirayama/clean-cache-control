class LocalSavePurchases {
  constructor (private readonly cacheStore: CacheStore) {}
  async save (): Promise<void> {
    this.cacheStore.delete('purchases')
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CacheStore {
  delete: (key: string) => void
}

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  key: string

  delete (key: string): void {
    this.deleteCallsCount++
    this.key = key
  }
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type SutTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore)
  return {
    sut,
    cacheStore
  }
}

describe('LocalSavePurchases', () => {
  it('Should not delete cache on sut.init', () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.deleteCallsCount).toBe(0)
  })

  it('Should delete old cache on sut.save', async () => {
    const { sut, cacheStore } = makeSut()
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
  })

  it('Should call delete with correct key', async () => {
    const { sut, cacheStore } = makeSut()
    await sut.save()
    expect(cacheStore.key).toBe('purchases')
  })
})
