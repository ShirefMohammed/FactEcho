import {
  ApiBodyResponse,
  GetAuthorArticlesResponse,
  GetAuthorResponse,
} from "@shared/types/apiTypes";

import { axiosPrivate } from "../axios";
import { endPoints } from "../endPoints";

/**
 * Server-side utility class for handling API requests related to authors.
 * Designed for use in Next.js server components and server actions.
 */
class AuthorsAPIs {
  /**
   * Get detailed information about a specific author by their ID.
   * @param {string} authorId - The ID of the author to retrieve.
   * @returns {Promise<ApiBodyResponse<GetAuthorResponse>>} A promise that resolves with the response data.
   */
  async getAuthorById(authorId: string): Promise<ApiBodyResponse<GetAuthorResponse>> {
    const response = await axiosPrivate.get(endPoints.authors.getById(authorId));
    return response.data;
  }

  /**
   * Get articles written by a specific author with pagination and ordering.
   * @param {string} authorId - The ID of the author to retrieve articles for.
   * @param {number} [page=1] - The page number to retrieve (default is 1).
   * @param {number} [limit=10] - The number of articles per page (default is 10).
   * @param {"old" | "new"} [order="new"] - The order to retrieve articles by (default is "new").
   * @returns {Promise<ApiBodyResponse<GetAuthorArticlesResponse>>} A promise that resolves with the response data.
   */
  async getAuthorArticles(
    authorId: string,
    page: number = 1,
    limit: number = 10,
    order: "old" | "new" = "new",
  ): Promise<ApiBodyResponse<GetAuthorArticlesResponse>> {
    const response = await axiosPrivate.get(endPoints.authors.getArticles(authorId), {
      params: { page, limit, order },
    });
    return response.data;
  }
}

// Create and export a singleton instance
export const authorsAPIs = new AuthorsAPIs();
