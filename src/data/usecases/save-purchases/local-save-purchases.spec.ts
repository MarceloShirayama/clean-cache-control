import { mockPurchases, CacheStoreSpy } from '@/data/tests'
import { LocalSavePurchases } from '@/data/usecases'

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
  it('Should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.messages).toEqual([])
  })

  it('Should delete old cache on sut.save', async () => {
    const { sut, cacheStore } = makeSut()
    await sut.save(mockPurchases())
    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert
    ])
    expect(cacheStore.deleteKey).toBe('purchases')
  })

  it('Should not insert new cache if delete fails', () => {
    const { sut, cacheStore } = makeSut()
    cacheStore.simulateDeleteError()
    const promise = sut.save(mockPurchases())
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete])
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow()
  })

  it('Should insert new cache if delete succeeds', async () => {
    const { sut, cacheStore } = makeSut()
    const purchases = mockPurchases()
    await sut.save(purchases)
    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert
    ])
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual(purchases)
  })

  it('Should throw error if insert throws error', () => {
    const { sut, cacheStore } = makeSut()
    cacheStore.simulateInsertError()
    const promise = sut.save(mockPurchases())
    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert
    ])
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow()
  })
})
