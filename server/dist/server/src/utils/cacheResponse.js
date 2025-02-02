"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheResponse = void 0;
var cache_1 = require("../cache");
/**
 * Caches the response for a given request.
 *
 * @param req - The Express request object.
 * @param value - The value to cache.
 * @param ttl - Optional time-to-live in seconds. If not provided, the cache default TTL will be used.
 */
var cacheResponse = function (req, value, ttl) {
    var key = cache_1.cacheService.generateKey(req);
    cache_1.cacheService.set(key, value, ttl);
    // console.log(`cacheResponse: key: ${key} is cached.`);
};
exports.cacheResponse = cacheResponse;
