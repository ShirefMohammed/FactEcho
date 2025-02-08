import {
  ApiBodyResponse,
  GetArticleResponse,
  GetArticlesResponse,
  GetExploredArticlesResponse,
  GetLatestArticlesResponse,
  GetTotalArticlesCountResponse,
  GetTrendArticlesResponse,
  SearchArticlesResponse,
} from "@shared/types/apiTypes";

import { axiosPrivate } from "../axios";
import { endPoints } from "../endPoints";

/**
 * Class for handling article-related API requests.
 */
export class ArticlesAPI {
  /**
   * Get all articles with pagination and ordering.
   * @param {number} page - The page number to retrieve (default is 1).
   * @param {number} limit - The number of articles per page (default is 10).
   * @param {"old" | "new"} order - The order to retrieve articles by (default is "new").
   * @returns {Promise<ApiBodyResponse<GetArticlesResponse>>} A promise that resolves with the response data.
   */
  static async getArticles(
    page: number = 1,
    limit: number = 10,
    order: "old" | "new" = "new",
  ): Promise<ApiBodyResponse<GetArticlesResponse>> {
    const response = await axiosPrivate.get(endPoints.articles.getAll, {
      params: { page, limit, order },
    });
    return response.data;
  }

  /**
   * Search for articles based on a search query and pagination.
   * @param {string} searchKey - The search keyword for querying articles.
   * @param {number} page - The page number to retrieve (default is 1).
   * @param {number} limit - The number of articles per page (default is 10).
   * @param {"old" | "new"} order - The order to retrieve articles by (default is "new").
   * @returns {Promise<ApiBodyResponse<SearchArticlesResponse>>} A promise that resolves with the response data.
   */
  static async searchArticles(
    searchKey: string,
    page: number = 1,
    limit: number = 10,
    order: "old" | "new" = "new",
  ): Promise<ApiBodyResponse<SearchArticlesResponse>> {
    const response = await axiosPrivate.get(endPoints.articles.search, {
      params: { searchKey, page, limit, order },
    });
    return response.data;
  }

  /**
   * Get the total number of articles.
   * @returns {Promise<ApiBodyResponse<GetTotalArticlesCountResponse>>} A promise that resolves with the response data.
   */
  static async getTotalArticlesCount(): Promise<ApiBodyResponse<GetTotalArticlesCountResponse>> {
    const response = await axiosPrivate.get(endPoints.articles.count);
    return response.data;
  }

  /**
   * Get explored articles.
   * @param {number} limit - The number of articles to retrieve (default is 10).
   * @returns {Promise<ApiBodyResponse<GetExploredArticlesResponse>>} A promise that resolves with the response data.
   */
  static async getExploredArticles(
    limit: number = 10,
  ): Promise<ApiBodyResponse<GetExploredArticlesResponse>> {
    const response = await axiosPrivate.get(endPoints.articles.explore, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Get trending articles.
   * @param {number} limit - The number of articles to retrieve (default is 10).
   * @returns {Promise<ApiBodyResponse<GetTrendArticlesResponse>>} A promise that resolves with the response data.
   */
  static async getTrendArticles(
    limit: number = 10,
  ): Promise<ApiBodyResponse<GetTrendArticlesResponse>> {
    const response = await axiosPrivate.get(endPoints.articles.trend, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Get the latest articles.
   * @param {number} limit - The number of articles to retrieve (default is 10).
   * @returns {Promise<ApiBodyResponse<GetLatestArticlesResponse>>} A promise that resolves with the response data.
   */
  static async getLatestArticles(
    limit: number = 10,
  ): Promise<ApiBodyResponse<GetLatestArticlesResponse>> {
    const response = await axiosPrivate.get(endPoints.articles.latest, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Get detailed information about a specific article by its ID.
   * @param {string} articleId - The ID of the article to retrieve.
   * @returns {Promise<ApiBodyResponse<GetArticleResponse>>} A promise that resolves with the response data.
   */
  static async getArticleById(articleId: string): Promise<ApiBodyResponse<GetArticleResponse>> {
    const response = await axiosPrivate.get(endPoints.articles.getById(articleId));
    return response.data;
  }
}
