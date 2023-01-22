import { CacheStore } from "@/data/protocols/cache";
import { SavePurchases, LoadPurchases } from "@/domain/use-cases";

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
  private readonly key = "purchases";

  constructor(
    private readonly cacheStore: CacheStore,
    private readonly timestamp: Date
  ) {}

  async save(purchases: SavePurchases.Params[]): Promise<void> {
    this.cacheStore.replace(this.key, {
      timestamp: this.timestamp,
      value: purchases,
    });
  }

  async loadAll(): Promise<LoadPurchases.Result[]> {
    try {
      this.cacheStore.fetch(this.key);

      return [];
    } catch (error) {
      this.cacheStore.delete(this.key);

      return [];
    }
  }
}
