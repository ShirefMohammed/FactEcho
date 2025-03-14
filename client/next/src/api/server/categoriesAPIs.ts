import {
  ApiBodyResponse,
  GetCategoriesResponse,
  GetCategoryArticlesResponse,
  GetCategoryResponse,
  GetTotalCategoriesCountResponse,
  SearchCategoriesResponse,
} from "@shared/types/apiTypes";

import { axiosPrivate } from "../axios";
import { endPoints } from "../endPoints";

/**
 * Server-side utility class for handling API requests related to categories.
 * Designed for use in Next.js server components and server actions.
 */
class CategoriesAPIs {
  /**
   * Get all categories with pagination and ordering.
   * @param {number} page - The page number to retrieve (default is 1).
   * @param {number} limit - The number of categories per page (default is 10).
   * @param {"old" | "new"} order - The order to retrieve categories by (default is "new").
   * @returns {Promise<ApiBodyResponse<GetCategoriesResponse>>} A promise that resolves with the response data.
   */
  async getCategories(
    page: number = 1,
    limit: number = 10,
    order: "old" | "new" = "new",
  ): Promise<ApiBodyResponse<GetCategoriesResponse>> {
    const response = await axiosPrivate.get(endPoints.categories.getAll, {
      params: { page, limit, order },
    });
    return response.data;
  }

  /**
   * Search for categories based on a search query and pagination.
   * @param {string} searchKey - The search keyword for querying categories.
   * @param {number} page - The page number to retrieve (default is 1).
   * @param {number} limit - The number of categories per page (default is 10).
   * @param {"old" | "new"} order - The order to retrieve categories by (default is "new").
   * @returns {Promise<ApiBodyResponse<SearchCategoriesResponse>>} A promise that resolves with the response data.
   */
  async searchCategories(
    searchKey: string,
    page: number = 1,
    limit: number = 10,
    order: "old" | "new" = "new",
  ): Promise<ApiBodyResponse<SearchCategoriesResponse>> {
    const response = await axiosPrivate.get(endPoints.categories.search, {
      params: { searchKey, page, limit, order },
    });
    return response.data;
  }

  /**
   * Get the total number of categories.
   * @returns {Promise<ApiBodyResponse<GetTotalCategoriesCountResponse>>} A promise that resolves with the response data.
   */
  async getTotalCategoriesCount(): Promise<ApiBodyResponse<GetTotalCategoriesCountResponse>> {
    const response = await axiosPrivate.get(endPoints.categories.count);
    return response.data;
  }

  /**
   * Get detailed information about a specific category by its ID.
   * @param {string} categoryId - The ID of the category to retrieve.
   * @returns {Promise<ApiBodyResponse<GetCategoryResponse>>} A promise that resolves with the response data.
   */
  async getCategoryById(categoryId: string): Promise<ApiBodyResponse<GetCategoryResponse>> {
    const response = await axiosPrivate.get(endPoints.categories.getById(categoryId));
    return response.data;
  }

  /**
   * Get articles related to a specific category with pagination and ordering.
   * @param {string} categoryId - The ID of the category to get articles for.
   * @param {number} [page=1] - The page number to retrieve (default is 1).
   * @param {number} [limit=10] - The number of articles per page (default is 10).
   * @param {"old" | "new"} [order="new"] - The order to retrieve articles by (default is "new").
   * @returns {Promise<ApiBodyResponse<GetCategoryArticlesResponse>>} A promise that resolves with the response data.
   */
  async getCategoryArticles(
    categoryId: string,
    page: number = 1,
    limit: number = 10,
    order: "old" | "new" = "new",
  ): Promise<ApiBodyResponse<GetCategoryArticlesResponse>> {
    const response = await axiosPrivate.get(endPoints.categories.getArticles(categoryId), {
      params: { page, limit, order },
    });
    return response.data;
  }
}

// Create and export a singleton instance
export const categoriesAPIs = new CategoriesAPIs();
