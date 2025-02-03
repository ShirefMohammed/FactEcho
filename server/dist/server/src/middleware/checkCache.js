"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCache = void 0;
var cache_1 = require("../cache");
var httpStatusText_1 = require("../utils/httpStatusText");
/**
 * Middleware to check the cache before processing a request.
 * - If the requested data is found in the cache, it returns the cached response.
 * - If the data is not found, it proceeds to the next middleware or route handler.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next function.
 *
 * @example
 * app.get("/data", checkCache, (req, res) => {
 *   // Process request and cache the response
 * });
 */
var checkCache = function (req, res, next) {
    var key = cache_1.cacheService.generateKey(req); // Generate the cache key dynamically
    var cachedResponse = cache_1.cacheService.get(key); // Retrieve the cached response
    // If the response is found in the cache, return it
    if (cachedResponse) {
        // Reset the TTL to the default
        cache_1.cacheService.ttl(key);
        var response = {
            statusText: httpStatusText_1.httpStatusText.SUCCESS,
            message: "Data retrieved successfully.",
            data: cachedResponse,
        };
        // console.log(`checkCache: Cache hit for key: ${key}`);
        return res.status(200).json(response);
    }
    // If the response is not found, proceed to the next middleware or route handler
    // console.log(`checkCache: Cache miss for key: ${key}`);
    next();
};
exports.checkCache = checkCache;
