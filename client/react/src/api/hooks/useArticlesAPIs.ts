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

import { useAxiosPrivate } from "../../hooks";
import { endPoints } from "../endPoints";

/**
 * Custom hook for handling API requests related to articles.
 * @returns {Object} Methods for interacting with the articles API.
 */
export const useArticlesAPIs = () => {
  const axiosPrivate = useAxiosPrivate();

  /**
   * Get all articles with pagination and ordering.
   * @param {number} page - The page number to retrieve (default is 1).
   * @param {number} limit - The number of articles per page (default is 10).
   * @param {"old" | "new"} order - The order to retrieve articles by (default is "new").
   * @returns {Promise<ApiBodyResponse<GetArticlesResponse>>} A promise that resolves with the response data.
   */
  const getArticles = async (
    page: number = 1,
    limit: number = 10,
    order: "old" | "new" = "new",
  ): Promise<ApiBodyResponse<GetArticlesResponse>> => {
    const response = await axiosPrivate.get(endPoints.articles.getAll, {
      params: { page, limit, order },
    });
    return response.data;
  };

  /**
   * Search for articles based on a search query and pagination.
   * @param {string} searchKey - The search keyword for querying articles.
   * @param {number} page - The page number to retrieve (default is 1).
   * @param {number} limit - The number of articles per page (default is 10).
   * @param {"old" | "new"} order - The order to retrieve articles by (default is "new").
   * @returns {Promise<ApiBodyResponse<SearchArticlesResponse>>} A promise that resolves with the response data.
   */
  const searchArticles = async (
    searchKey: string,
    page: number = 1,
    limit: number = 10,
    order: "old" | "new" = "new",
  ): Promise<ApiBodyResponse<SearchArticlesResponse>> => {
    const response = await axiosPrivate.get(endPoints.articles.search, {
      params: { searchKey, page, limit, order },
    });
    return response.data;
  };

  /**
   * Get the total number of articles.
   * @returns {Promise<ApiBodyResponse<GetTotalArticlesCountResponse>>} A promise that resolves with the response data.
   */
  const getTotalArticlesCount = async (): Promise<
    ApiBodyResponse<GetTotalArticlesCountResponse>
  > => {
    const response = await axiosPrivate.get(endPoints.articles.count);
    return response.data;
  };

  /**
   * Get explored articles.
   * @param {number} limit - The number of articles to retrieve (default is 10).
   * @returns {Promise<ApiBodyResponse<GetExploredArticlesResponse>>} A promise that resolves with the response data.
   */
  const getExploredArticles = async (
    limit: number = 10,
  ): Promise<ApiBodyResponse<GetExploredArticlesResponse>> => {
    const response = await axiosPrivate.get(endPoints.articles.explore, {
      params: { limit },
    });
    return response.data;
  };

  /**
   * Get trending articles.
   * @param {number} limit - The number of articles to retrieve (default is 10).
   * @returns {Promise<ApiBodyResponse<GetTrendArticlesResponse>>} A promise that resolves with the response data.
   */
  const getTrendArticles = async (
    limit: number = 10,
  ): Promise<ApiBodyResponse<GetTrendArticlesResponse>> => {
    const response = await axiosPrivate.get(endPoints.articles.trend, {
      params: { limit },
    });
    return response.data;
  };

  /**
   * Get the latest articles.
   * @param {number} limit - The number of articles to retrieve (default is 10).
   * @returns {Promise<ApiBodyResponse<GetLatestArticlesResponse>>} A promise that resolves with the response data.
   */
  const getLatestArticles = async (
    limit: number = 10,
  ): Promise<ApiBodyResponse<GetLatestArticlesResponse>> => {
    const response = await axiosPrivate.get(endPoints.articles.latest, {
      params: { limit },
    });
    return response.data;
  };

  /**
   * Get saved articles with pagination and ordering.
   *
   * @param {number} [page=1] - The page number to retrieve (default is 1).
   * @param {number} [limit=10] - The number of saved articles per page (default is 10).
   * @param {"old" | "new"} [order="new"] - The order to retrieve saved articles by (default is "new").
   * @returns {Promise<ApiBodyResponse<GetSavedArticlesResponse>>} A promise that resolves with the response data.
   */
  const getSavedArticles = async (
    page: number = 1,
    limit: number = 10,
    order: "old" | "new" = "new",
  ): Promise<ApiBodyResponse<GetSavedArticlesResponse>> => {
    const response = await axiosPrivate.get(endPoints.articles.saved, {
      params: { page, limit, order },
    });
    return response.data;
  };

  /**
   * Get detailed information about a specific article by its ID.
   * @param {string} articleId - The ID of the article to retrieve.
   * @returns {Promise<ApiBodyResponse<GetArticleResponse>>} A promise that resolves with the response data.
   */
  const getArticleById = async (
    articleId: string,
  ): Promise<ApiBodyResponse<GetArticleResponse>> => {
    const response = await axiosPrivate.get(endPoints.articles.getById(articleId));
    return response.data;
  };

  /**
   * Create a new article.
   * @param {CreateArticleRequest} data - The data to create a new article.
   * @returns {Promise<ApiBodyResponse<CreateArticleResponse>>} A promise that resolves with the response data.
   */
  const createArticle = async (
    data: CreateArticleRequest,
  ): Promise<ApiBodyResponse<CreateArticleResponse>> => {
    const response = await axiosPrivate.post(endPoints.articles.create, data);
    return response.data;
  };

  /**
   * Update an existing article by its ID.
   * @param {string} articleId - The ID of the article to update.
   * @param {UpdateArticleRequest} data - The data to update the article.
   * @returns {Promise<ApiBodyResponse<UpdateArticleResponse>>} A promise that resolves with the response data.
   */
  const updateArticle = async (
    articleId: string,
    data: UpdateArticleRequest,
  ): Promise<ApiBodyResponse<UpdateArticleResponse>> => {
    const response = await axiosPrivate.patch(endPoints.articles.update(articleId), data);
    return response.data;
  };

  /**
   * Delete an article by its ID.
   * @param {string} articleId - The ID of the article to delete.
   * @returns {Promise<ApiBodyResponse<DeleteArticleResponse>>} A promise that resolves with the response data.
   */
  const deleteArticle = async (
    articleId: string,
  ): Promise<ApiBodyResponse<DeleteArticleResponse>> => {
    const response = await axiosPrivate.delete(endPoints.articles.delete(articleId));
    return response.data;
  };

  /**
   * Check if an article is saved.
   * @param {string} articleId - The ID of the article to check.
   * @returns {Promise<ApiBodyResponse<IsArticleSavedResponse>>} A promise that resolves with the response data.
   */
  const isArticleSaved = async (
    articleId: string,
  ): Promise<ApiBodyResponse<IsArticleSavedResponse>> => {
    const response = await axiosPrivate.get(endPoints.articles.isSaved(articleId));
    return response.data;
  };

  /**
   * Save an article.
   * @param {string} articleId - The ID of the article to save.
   * @returns {Promise<ApiBodyResponse<SaveArticleResponse>>} A promise that resolves with the response data.
   */
  const saveArticle = async (articleId: string): Promise<ApiBodyResponse<SaveArticleResponse>> => {
    const response = await axiosPrivate.post(endPoints.articles.save(articleId));
    return response.data;
  };

  /**
   * Unsave an article.
   * @param {string} articleId - The ID of the article to unsave.
   * @returns {Promise<ApiBodyResponse<UnsaveArticleResponse>>} A promise that resolves with the response data.
   */
  const unsaveArticle = async (
    articleId: string,
  ): Promise<ApiBodyResponse<UnsaveArticleResponse>> => {
    const response = await axiosPrivate.delete(endPoints.articles.unsave(articleId));
    return response.data;
  };

  return {
    getArticles,
    searchArticles,
    getTotalArticlesCount,
    getExploredArticles,
    getTrendArticles,
    getLatestArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    getSavedArticles,
    isArticleSaved,
    saveArticle,
    unsaveArticle,
  };
};
