import { Request } from "express";
import NodeCache from "node-cache";

import { CacheService } from "../interfaces/cacheService";

export const DEFAULT_CACHE_TTL = 300; // Default TTL in seconds

export class NodeCacheUtils implements CacheService {
  private cache: NodeCache | null = null;

  /**
   * Initializes and configures a `node-cache` instance.
   * - Creates a new `node-cache` instance with optional configuration.
   * - Sets up error handling for the cache instance.
   *
   * @throws {Error} If the cache initialization fails.
   */
  initializeNodeCache = async (): Promise<void> => {
    try {
      // Initialize the cache with optional configuration
      this.cache = new NodeCache({
        stdTTL: DEFAULT_CACHE_TTL, // Default time-to-live for keys in seconds
        checkperiod: 120, // Automatic delete check interval in seconds
        useClones: true, // Store cloned copies of values to avoid reference issues
      });

      console.log("NodeCache initialized successfully");
    } catch (error) {
      console.error("Failed to initialize NodeCache:", error);
      // process.exit(1); // Exit with general error code
    }
  };

  /**
   * Generates a cache key based on the request method and original URL.
   * This ensures that each unique request (including query parameters) is cached separately.
   *
   * @param req - The Express request object.
   * @returns A string representing the cache key.
   *
   * @example
   * const key = generateKey(req); // "GET:/users?page=1&limit=10"
   */
  generateKey = (req: Request): string => {
    return `${req.method}:${req.originalUrl}`;
  };

  /**
   * Sets a value in the cache.
   * The cache key is generated using the request method and original URL.
   *
   * @param key - The cache key.
   * @param value - The value to cache.
   * @param ttl - Optional time-to-live in seconds. If not provided, the cache default TTL will be used.
   *
   * @example
   * set("GET:/users", { users: [...] }, 60); // Cache for 60 seconds
   */
  set = (key: string, value: any, ttl?: number): void => {
    if (this.cache) {
      if (ttl !== undefined) {
        this.cache.set(key, value, ttl);
      } else {
        this.cache.set(key, value);
      }
    }
  };

  /**
   * Retrieves a value from the cache.
   * The cache key is generated using the request method and original URL.
   *
   * @param key - The cache key.
   * @returns The cached value or undefined if not found.
   *
   * @example
   * const cachedData = get("GET:/users");
   */
  get = (key: string): any => {
    if (this.cache) {
      return this.cache.get(key);
    }
    return undefined;
  };

  /**
   * Updates the time-to-live (TTL) for a cached item.
   * The cache key is generated using the request method and original URL.
   *
   * @param key - The cache key.
   * @param ttl - The new time-to-live in seconds.
   *
   * @example
   * ttl("GET:/users", 60); // Reset TTL to 60 seconds
   */
  ttl = (key: string, ttl?: number): void => {
    if (this.cache) {
      if (ttl !== undefined) {
        this.cache.ttl(key, ttl);
      } else {
        this.cache.ttl(key, DEFAULT_CACHE_TTL);
      }
    }
  };

  /**
   * Deletes a cached item.
   *
   * @param key - The cache key.
   *
   * @example
   * del("GET:/users"); // Deletes the cached item for the key "GET:/users"
   */
  del = (key: string): void => {
    if (this.cache) {
      this.cache.del(key);
    }
  };

  /**
   * Deletes all cached items that start with the given base URL.
   * This function skips the "METHOD:" prefix when checking cache keys.
   *
   * @param baseUrl - The base URL to match (e.g., "/api/v1/articles/").
   */
  deleteCachedItemsByBaseUrl = (baseUrl: string): void => {
    if (this.cache) {
      const keys = this.cache.keys(); // Get all cache keys
      keys.forEach((key) => {
        // Skip the "METHOD:" prefix and check if the URL part starts with the base URL
        const urlPart = key.split(":").slice(1).join(":");
        if (urlPart.startsWith(baseUrl)) {
          this.cache?.del(key); // Delete the cached item
          // console.log(`nodeCacheUtils: key: ${key} is deleted.`);
        }
      });
    }
  };
}
