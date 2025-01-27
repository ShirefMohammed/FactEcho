import { Request } from "express";

import { cacheService } from "../cache";

/**
 * Extracts the base URL from the request and deletes all cached items that start with it.
 *
 * @param req - The Express request object.
 */
export const deleteRelatedCachedItemsForRequest = (req: Request): void => {
  const originalUrl = req.originalUrl; // e.g., "/api/v1/users/:userId"
  const baseUrl = originalUrl.split("/").slice(0, 4).join("/") + "/"; // e.g., "/api/v1/users/"
  cacheService.deleteCachedItemsByBaseUrl(baseUrl);
};
