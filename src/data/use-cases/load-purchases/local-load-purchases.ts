import { CacheStore } from "@/data/protocols/cache";
import { CachePolicy } from "@/data/protocols/cache";
import { SavePurchases, LoadPurchases } from "@/domain/use-cases";

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
  private readonly key = "purchases";

  constructor(
    private readonly cacheStore: CacheStore,
    private readonly currentDate: Date
  ) {}

  async save(purchases: SavePurchases.Params[]): Promise<void> {
    this.cacheStore.replace(this.key, {
      timestamp: this.currentDate,
      value: purchases,
    });
  }

  async loadAll(): Promise<LoadPurchases.Result[]> {
    try {
      const cache = this.cacheStore.fetch(this.key);

      return CachePolicy.validate(cache.timestamp, this.currentDate)
        ? cache.value
        : [];
    } catch (error) {
      return [];
    }
  }

  validate(): void {
    try {
      const cache = this.cacheStore.fetch(this.key);

      if (!CachePolicy.validate(cache.timestamp, this.currentDate))
        throw new Error();
    } catch (error) {
      this.cacheStore.delete(this.key);
    }
  }
}
