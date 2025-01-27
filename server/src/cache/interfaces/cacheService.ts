import { Request } from "express";

export interface CacheService {
  /**
   * Generates a cache key based on the request method and original URL.
   *
   * @param req - The Express request object.
   * @returns A string representing the cache key.
   */
  generateKey(req: Request): string;

  /**
   * Sets a value in the cache.
   *
   * @param key - The cache key.
   * @param value - The value to cache.
   * @param ttl - Optional time-to-live in seconds, default ttl will be set if no ttl.
   */
  set(key: string, value: any, ttl?: number): void;

  /**
   * Retrieves a value from the cache.
   *
   * @param key - The cache key.
   * @returns The cached value or undefined if not found.
   */
  get(key: string): any;

  /**
   * Updates the time-to-live (TTL) for a cached item.
   * If ttl is undefined, default ttl will be set.
   *
   * @param key - The cache key.
   * @param ttl - Optional new time-to-live in seconds.
   */
  ttl(key: string, ttl?: number): void;

  /**
   * Deletes a cached item.
   *
   * @param key - The cache key.
   */
  del(key: string): void;

  /**
   * Deletes all cached items that start with the given base URL after METHOD:.
   *
   * @param baseUrl - The base URL to match (e.g., "/api/v1/users/").
   */
  deleteCachedItemsByBaseUrl(baseUrl: string): void;
}
