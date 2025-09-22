interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const cacheService = {
  get: <T>(key: string): T | null => {
    const entry = cache.get(key);
    if (!entry) {
      return null;
    }

    const isExpired = (Date.now() - entry.timestamp) > CACHE_TTL_MS;
    if (isExpired) {
      cache.delete(key);
      return null;
    }

    return entry.data as T;
  },

  set: <T>(key: string, data: T): void => {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    cache.set(key, entry);
  },

  invalidate: (key: string): void => {
    cache.delete(key);
  },

  invalidateAll: (): void => {
    cache.clear();
  },
};
