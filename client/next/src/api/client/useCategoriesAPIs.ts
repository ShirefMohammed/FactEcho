import {
  ApiBodyResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  DeleteCategoryResponse,
  GetCategoriesResponse,
  GetCategoryArticlesResponse,
  GetCategoryResponse,
  GetTotalCategoriesCountResponse,
  SearchCategoriesResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from "shared/types/apiTypes";

import { useAxiosPrivate } from "../../hooks";
import { endPoints } from "../endPoints";

/**
 * Custom hook for handling API requests related to categories.
 * @returns An object with methods for category-related API actions.
 */
export const useCategoriesAPIs = () => {
  const axiosPrivate = useAxiosPrivate();

  /**
   * Get all categories with pagination and ordering.
   * @param {number} page - The page number to retrieve (default is 1).
   * @param {number} limit - The number of categories per page (default is 10).
   * @param {"old" | "new"} order - The order to retrieve categories by (default is "new").
   * @returns {Promise<ApiBodyResponse<GetCategoriesResponse>>} A promise that resolves with the response data.
   */
  const getCategories = async (
    page: number = 1,
    limit: number = 10,
    order: "old" | "new" = "new",
  ): Promise<ApiBodyResponse<GetCategoriesResponse>> => {
    const response = await axiosPrivate.get(endPoints.categories.getAll, {
      params: { page, limit, order },
    });
    return response.data;
  };

  /**
   * Search for categories based on a search query and pagination.
   * @param {string} searchKey - The search keyword for querying categories.
   * @param {number} page - The page number to retrieve (default is 1).
   * @param {number} limit - The number of categories per page (default is 10).
   * @param {"old" | "new"} order - The order to retrieve categories by (default is "new").
   * @returns {Promise<ApiBodyResponse<SearchCategoriesResponse>>} A promise that resolves with the response data.
   */
  const searchCategories = async (
    searchKey: string,
    page: number = 1,
    limit: number = 10,
    order: "old" | "new" = "new",
  ): Promise<ApiBodyResponse<SearchCategoriesResponse>> => {
    const response = await axiosPrivate.get(endPoints.categories.search, {
      params: { searchKey, page, limit, order },
    });
    return response.data;
  };

  /**
   * Get the total number of categories.
   * @returns {Promise<ApiBodyResponse<GetTotalCategoriesCountResponse>>} A promise that resolves with the response data.
   */
  const getTotalCategoriesCount = async (): Promise<
    ApiBodyResponse<GetTotalCategoriesCountResponse>
  > => {
    const response = await axiosPrivate.get(endPoints.categories.count);
    return response.data;
  };

  /**
   * Get detailed information about a specific category by its ID.
   * @param {string} categoryId - The ID of the category to retrieve.
   * @returns {Promise<ApiBodyResponse<GetCategoryResponse>>} A promise that resolves with the response data.
   */
  const getCategoryById = async (
    categoryId: string,
  ): Promise<ApiBodyResponse<GetCategoryResponse>> => {
    const response = await axiosPrivate.get(endPoints.categories.getById(categoryId));
    return response.data;
  };

  /**
   * Create a new category.
   * @param {CreateCategoryRequest} data - The data to create a new category.
   * @returns {Promise<ApiBodyResponse<CreateCategoryResponse>>} A promise that resolves with the response data.
   */
  const createCategory = async (
    data: CreateCategoryRequest,
  ): Promise<ApiBodyResponse<CreateCategoryResponse>> => {
    const response = await axiosPrivate.post(endPoints.categories.create, data);
    return response.data;
  };

  /**
   * Update an existing category by its ID.
   * @param {string} categoryId - The ID of the category to update.
   * @param {UpdateCategoryRequest} data - The data to update the category.
   * @returns {Promise<ApiBodyResponse<UpdateCategoryResponse>>} A promise that resolves with the response data.
   */
  const updateCategory = async (
    categoryId: string,
    data: UpdateCategoryRequest,
  ): Promise<ApiBodyResponse<UpdateCategoryResponse>> => {
    const response = await axiosPrivate.patch(endPoints.categories.update(categoryId), data);
    return response.data;
  };

  /**
   * Delete a category by its ID.
   * @param {string} categoryId - The ID of the category to delete.
   * @returns {Promise<ApiBodyResponse<DeleteCategoryResponse>>} A promise that resolves with the response data.
   */
  const deleteCategory = async (
    categoryId: string,
  ): Promise<ApiBodyResponse<DeleteCategoryResponse>> => {
    const response = await axiosPrivate.delete(endPoints.categories.delete(categoryId));
    return response.data;
  };

  /**
   * Get articles related to a specific category with pagination and ordering.
   *
   * @param {string} categoryId - The ID of the category to get articles for.
   * @param {number} [page=1] - The page number to retrieve (default is 1).
   * @param {number} [limit=10] - The number of articles per page (default is 10).
   * @param {"old" | "new"} [order="new"] - The order to retrieve articles by (default is "new").
   * @returns {Promise<ApiBodyResponse<GetCategoryArticlesResponse>>} A promise that resolves with the response data.
   */
  const getCategoryArticles = async (
    categoryId: string,
    page: number = 1,
    limit: number = 10,
    order: "old" | "new" = "new",
  ): Promise<ApiBodyResponse<GetCategoryArticlesResponse>> => {
    const response = await axiosPrivate.get(endPoints.categories.getArticles(categoryId), {
      params: { page, limit, order },
    });
    return response.data;
  };

  return {
    getCategories,
    searchCategories,
    getTotalCategoriesCount,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryArticles,
  };
};
