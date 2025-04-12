import {
  ApiBodyResponse,
  GetAuthorArticlesResponse,
  GetAuthorResponse,
  GetAuthorsResponse,
  GetTotalAuthorsCountResponse,
  SearchAuthorsResponse,
  UpdateAuthorPermissionsRequest,
  UpdateAuthorPermissionsResponse,
} from "@/types/apiTypes";

import { axiosPrivate } from "../axios";
import { endPoints } from "../endPoints";

/**
 * Server-side utility class for handling API requests related to authors.
 * Designed for use in Next.js server components and server actions.
 */
class AuthorsAPIs {
  /**
   * Get all authors with pagination.
   * @param {number} [page=1] - The page number to retrieve (default is 1).
   * @param {number} [limit=10] - The number of authors per page (default is 10).
   * @returns {Promise<ApiBodyResponse<GetAuthorsResponse>>} A promise that resolves with the response data.
   */
  async getAuthors(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiBodyResponse<GetAuthorsResponse>> {
    const response = await axiosPrivate.get(endPoints.authors.getAll, {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Search for authors based on a search query and pagination.
   * @param {string} searchKey - The search keyword for querying authors.
   * @param {number} [page=1] - The page number to retrieve (default is 1).
   * @param {number} [limit=10] - The number of authors per page (default is 10).
   * @returns {Promise<ApiBodyResponse<SearchAuthorsResponse>>} A promise that resolves with the response data.
   */
  async searchAuthors(
    searchKey: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiBodyResponse<SearchAuthorsResponse>> {
    const response = await axiosPrivate.get(endPoints.authors.search, {
      params: { searchKey, page, limit },
    });
    return response.data;
  }

  /**
   * Get the total number of authors.
   * @returns {Promise<ApiBodyResponse<GetTotalAuthorsCountResponse>>} A promise that resolves with the response data.
   */
  async getTotalAuthorsCount(): Promise<ApiBodyResponse<GetTotalAuthorsCountResponse>> {
    const response = await axiosPrivate.get(endPoints.authors.count);
    return response.data;
  }

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
   * Update the permissions of a specific author.
   * @param {string} authorId - The ID of the author to update.
   * @param {UpdateAuthorPermissionsRequest} data - The permissions data to update.
   * @returns {Promise<ApiBodyResponse<UpdateAuthorPermissionsResponse>>} A promise that resolves with the response data.
   */
  async updateAuthorPermissions(
    authorId: string,
    data: UpdateAuthorPermissionsRequest,
  ): Promise<ApiBodyResponse<UpdateAuthorPermissionsResponse>> {
    const response = await axiosPrivate.patch(endPoints.authors.updatePermissions(authorId), data);
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

export const authorsAPIs = new AuthorsAPIs();
