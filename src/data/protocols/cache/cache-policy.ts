import { config } from "@/config";

export class CachePolicy {
  private static maxCacheInDays = config.cacheExpirationInDays;

  private constructor() {}

  static validate(timestamp: Date, currentDate: Date): boolean {
    const maxAge = new Date(timestamp);
    maxAge.setDate(maxAge.getDate() + this.maxCacheInDays);

    return maxAge > currentDate;
  }
}
