import { Request } from "express";

import { cacheService } from "../cache";

/**
 * Caches the response for a given request.
 *
 * @param req - The Express request object.
 * @param value - The value to cache.
 * @param ttl - Optional time-to-live in seconds. If not provided, the cache default TTL will be used.
 */
export const cacheResponse = (req: Request, value: any, ttl?: number): void => {
  const key = cacheService.generateKey(req);
  cacheService.set(key, value, ttl);
  // console.log(`cacheResponse: key: ${key} is cached.`);
};
