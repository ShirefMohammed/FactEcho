import {
  ApiBodyResponse,
  CreateArticleRequest,
  CreateArticleResponse,
  DeleteArticleResponse,
  GetArticleResponse,
  GetArticlesResponse,
  GetExploredArticlesResponse,
  GetLatestArticlesResponse,
  GetSavedArticlesResponse,
  GetTotalArticlesCountResponse,
  GetTrendArticlesResponse,
  IsArticleSavedResponse,
  SaveArticleResponse,
  SearchArticlesResponse,
  UnsaveArticleResponse,
  UpdateArticleRequest,
  UpdateArticleResponse,
} from "@shared/types/apiTypes";

import axios, { axiosPrivate } from "../axios";
import { endPoints } from "../endPoints";

/**
 * Server-side utility class for handling API requests related to articles.
 * Designed for use in Next.js server components and server actions.
 */
class ArticlesAPIs {
  /**
   * Get all articles with pagination and ordering.
   * @param {number} page - The page number to retrieve (default is 1).
   * @param {number} limit - The number of articles per page (default is 10).
   * @param {"old" | "new"} order - The order to retrieve articles by (default is "new").
   * @returns {Promise<ApiBodyResponse<GetArticlesResponse>>} A promise that resolves with the response data.
   */
  async getArticles(
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
  async searchArticles(
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
  async getTotalArticlesCount(): Promise<ApiBodyResponse<GetTotalArticlesCountResponse>> {
    const response = await axiosPrivate.get(endPoints.articles.count);
    return response.data;
  }

  /**
   * Get explored articles.
   * @param {number} limit - The number of articles to retrieve (default is 10).
   * @returns {Promise<ApiBodyResponse<GetExploredArticlesResponse>>} A promise that resolves with the response data.
   */
  async getExploredArticles(
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
  async getTrendArticles(limit: number = 10): Promise<ApiBodyResponse<GetTrendArticlesResponse>> {
    const response = await axiosPrivate.get(endPoints.articles.trend, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Get latest articles.
   * @param {number} limit - The number of articles to retrieve (default is 10).
   * @returns {Promise<ApiBodyResponse<GetLatestArticlesResponse>>} A promise that resolves with the response data.
   */
  async getLatestArticles(limit: number = 10): Promise<ApiBodyResponse<GetLatestArticlesResponse>> {
    const response = await axiosPrivate.get(endPoints.articles.latest, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * Get an article by its ID.
   * @param {string} id - The ID of the article to retrieve.
   * @returns {Promise<ApiBodyResponse<GetArticleResponse>>} A promise that resolves with the response data.
   */
  async getArticleById(id: string): Promise<ApiBodyResponse<GetArticleResponse>> {
    const response = await axiosPrivate.get(`${endPoints.articles.getById(id)}`);
    return response.data;
  }

  /**
   * Create a new article.
   * @param {CreateArticleRequest} articleData - The data for creating the article.
   * @returns {Promise<ApiBodyResponse<CreateArticleResponse>>} A promise that resolves with the response data.
   */
  async createArticle(
    articleData: CreateArticleRequest,
  ): Promise<ApiBodyResponse<CreateArticleResponse>> {
    const response = await axiosPrivate.post(endPoints.articles.create, articleData);
    return response.data;
  }

  /**
   * Update an existing article.
   * @param {string} id - The ID of the article to update.
   * @param {UpdateArticleRequest} articleData - The updated article data.
   * @returns {Promise<ApiBodyResponse<UpdateArticleResponse>>} A promise that resolves with the response data.
   */
  async updateArticle(
    id: string,
    articleData: UpdateArticleRequest,
  ): Promise<ApiBodyResponse<UpdateArticleResponse>> {
    const response = await axiosPrivate.put(`${endPoints.articles.update}/${id}`, articleData);
    return response.data;
  }

  /**
   * Delete an article by its ID.
   * @param {string} id - The ID of the article to delete.
   * @returns {Promise<ApiBodyResponse<DeleteArticleResponse>>} A promise that resolves with the response data.
   */
  async deleteArticle(id: string): Promise<ApiBodyResponse<DeleteArticleResponse>> {
    const response = await axiosPrivate.delete(`${endPoints.articles.delete}/${id}`);
    return response.data;
  }

  /**
   * Get saved articles with pagination and ordering.
   * @param {number} page - The page number to retrieve (default is 1).
   * @param {number} limit - The number of articles per page (default is 10).
   * @param {"old" | "new"} order - The order to retrieve articles by (default is "new").
   * @returns {Promise<ApiBodyResponse<GetSavedArticlesResponse>>} A promise that resolves with the response data.
   */
  async getSavedArticles(
    page: number = 1,
    limit: number = 10,
    order: "old" | "new" = "new",
  ): Promise<ApiBodyResponse<GetSavedArticlesResponse>> {
    const response = await axiosPrivate.get(endPoints.articles.saved, {
      params: { page, limit, order },
    });
    return response.data;
  }

  /**
   * Check if an article is saved by the current user.
   * @param {string} id - The ID of the article to check.
   * @returns {Promise<ApiBodyResponse<IsArticleSavedResponse>>} A promise that resolves with the response data.
   */
  async isArticleSaved(id: string): Promise<ApiBodyResponse<IsArticleSavedResponse>> {
    const response = await axiosPrivate.get(`${endPoints.articles.isSaved}/${id}`);
    return response.data;
  }

  /**
   * Save an article for the current user.
   * @param {string} id - The ID of the article to save.
   * @returns {Promise<ApiBodyResponse<SaveArticleResponse>>} A promise that resolves with the response data.
   */
  async saveArticle(id: string): Promise<ApiBodyResponse<SaveArticleResponse>> {
    const response = await axiosPrivate.post(`${endPoints.articles.save}/${id}`);
    return response.data;
  }

  /**
   * Unsave an article for the current user.
   * @param {string} id - The ID of the article to unsave.
   * @returns {Promise<ApiBodyResponse<UnsaveArticleResponse>>} A promise that resolves with the response data.
   */
  async unsaveArticle(id: string): Promise<ApiBodyResponse<UnsaveArticleResponse>> {
    const response = await axiosPrivate.delete(`${endPoints.articles.unsave}/${id}`);
    return response.data;
  }
}

// Create and export a singleton instance
export const articlesAPIs = new ArticlesAPIs();
