import { CacheService } from "./interfaces/cacheService";
import { NodeCacheUtils } from "./nodeCache/nodeCacheUtils";

export let cacheService: CacheService;

/**
 * Initializes the cache service.
 */
export const initializeCache = async (): Promise<void> => {
  const nodeCacheUtils = new NodeCacheUtils();
  await nodeCacheUtils.initializeNodeCache();
  cacheService = nodeCacheUtils;
};
