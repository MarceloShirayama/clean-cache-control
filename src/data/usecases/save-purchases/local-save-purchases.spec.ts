import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usecases'
import { SavePurchases } from '@/domain/usecases'

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  insertCallsCount = 0
  deleteKey: string
  insertKey: string
  insertValues: SavePurchases.Params[] = []

  delete (key: string): void {
    this.deleteCallsCount++
    this.deleteKey = key
  }

  insert (key: string, value: any): void {
    this.insertCallsCount++
    this.insertKey = key
    this.insertValues = value
  }

  simulateDeleteError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete')
      .mockImplementationOnce(() => { throw new Error('') })
  }

  simulateInsertError (): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert')
      .mockImplementationOnce(() => { throw new Error('') })
  }
}

const mockPurchases = (): SavePurchases.Params[] => [
  {
    id: '1',
    date: new Date(),
    value: 50
  },
  {
    id: '2',
    date: new Date(),
    value: 70
  }
]

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
    await sut.save(mockPurchases())
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchases')
  })

  it('Should not insert new cache if delete fails', () => {
    const { sut, cacheStore } = makeSut()
    cacheStore.simulateDeleteError()
    const promise = sut.save(mockPurchases())
    expect(cacheStore.insertCallsCount).toBe(0)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow()
  })

  it('Should insert new cache if delete succeeds', async () => {
    const { sut, cacheStore } = makeSut()
    const purchases = mockPurchases()
    await sut.save(purchases)
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual(purchases)
  })

  it('Should throw error if insert throws error', () => {
    const { sut, cacheStore } = makeSut()
    cacheStore.simulateInsertError()
    const promise = sut.save(mockPurchases())
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(promise).rejects.toThrow()
  })
})
