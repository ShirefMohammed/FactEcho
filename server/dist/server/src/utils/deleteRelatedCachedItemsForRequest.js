"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRelatedCachedItemsForRequest = void 0;
var cache_1 = require("../cache");
/**
 * Extracts the base URL from the request and deletes all cached items that start with it.
 *
 * @param req - The Express request object.
 */
var deleteRelatedCachedItemsForRequest = function (req) {
    var originalUrl = req.originalUrl; // e.g., "/api/v1/users/:userId"
    var baseUrl = originalUrl.split("/").slice(0, 4).join("/") + "/"; // e.g., "/api/v1/users/"
    cache_1.cacheService.deleteCachedItemsByBaseUrl(baseUrl);
};
exports.deleteRelatedCachedItemsForRequest = deleteRelatedCachedItemsForRequest;
