import {
  ApiBodyResponse,
  GetAuthorArticlesResponse,
  GetAuthorResponse,
  GetAuthorsResponse,
  GetTotalAuthorsCountResponse,
  SearchAuthorsResponse,
  UpdateAuthorPermissionsRequest,
  UpdateAuthorPermissionsResponse,
} from "@shared/types/apiTypes";

import { useAxiosPrivate } from "../../hooks";
import { endPoints } from "../endPoints";

/**
 * Custom hook for handling API requests related to authors.
 * @returns An object with methods for author-related API actions.
 */
export const useAuthorsAPIs = () => {
  const axiosPrivate = useAxiosPrivate();

  /**
   * Get all authors with pagination.
   * @param {number} page - The page number to retrieve (default is 1).
   * @param {number} limit - The number of authors per page (default is 10).
   * @returns {Promise<ApiBodyResponse<GetAuthorsResponse>>} A promise that resolves with the response data.
   */
  const getAuthors = async (
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiBodyResponse<GetAuthorsResponse>> => {
    const response = await axiosPrivate.get(endPoints.authors.getAll, {
      params: { page, limit },
    });
    return response.data;
  };

  /**
   * Search for authors based on a search query and pagination.
   * @param {string} searchKey - The search keyword for querying authors.
   * @param {number} page - The page number to retrieve (default is 1).
   * @param {number} limit - The number of authors per page (default is 10).
   * @returns {Promise<ApiBodyResponse<SearchAuthorsResponse>>} A promise that resolves with the response data.
   */
  const searchAuthors = async (
    searchKey: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiBodyResponse<SearchAuthorsResponse>> => {
    const response = await axiosPrivate.get(endPoints.authors.search, {
      params: { searchKey, page, limit },
    });
    return response.data;
  };

  /**
   * Get the total number of authors.
   * @returns {Promise<ApiBodyResponse<GetTotalAuthorsCountResponse>>} A promise that resolves with the response data.
   */
  const getTotalAuthorsCount = async (): Promise<ApiBodyResponse<GetTotalAuthorsCountResponse>> => {
    const response = await axiosPrivate.get(endPoints.authors.count);
    return response.data;
  };

  /**
   * Get detailed information about a specific author by their ID.
   * @param {string} authorId - The ID of the author to retrieve.
   * @returns {Promise<ApiBodyResponse<GetAuthorResponse>>} A promise that resolves with the response data.
   */
  const getAuthorById = async (authorId: string): Promise<ApiBodyResponse<GetAuthorResponse>> => {
    const response = await axiosPrivate.get(endPoints.authors.getById(authorId));
    return response.data;
  };

  /**
   * Update the permissions of a specific author.
   * @param {string} authorId - The ID of the author to update.
   * @param {UpdateAuthorPermissionsRequest} data - The permissions data to update.
   * @returns {Promise<ApiBodyResponse<UpdateAuthorPermissionsResponse>>} A promise that resolves with the response data.
   */
  const updateAuthorPermissions = async (
    authorId: string,
    data: UpdateAuthorPermissionsRequest,
  ): Promise<ApiBodyResponse<UpdateAuthorPermissionsResponse>> => {
    const response = await axiosPrivate.patch(endPoints.authors.updatePermissions(authorId), data);
    return response.data;
  };

  /**
   * Get articles written by a specific author with pagination and ordering.
   *
   * @param {string} authorId - The ID of the author to retrieve articles for.
   * @param {number} [page=1] - The page number to retrieve (default is 1).
   * @param {number} [limit=10] - The number of articles per page (default is 10).
   * @param {"old" | "new"} [order="new"] - The order to retrieve articles by (default is "new").
   * @returns {Promise<ApiBodyResponse<GetAuthorArticlesResponse>>} A promise that resolves with the response data.
   */
  const getAuthorArticles = async (
    authorId: string,
    page: number = 1,
    limit: number = 10,
    order: "old" | "new" = "new",
  ): Promise<ApiBodyResponse<GetAuthorArticlesResponse>> => {
    const response = await axiosPrivate.get(endPoints.authors.getArticles(authorId), {
      params: { page, limit, order },
    });
    return response.data;
  };

  return {
    getAuthors,
    searchAuthors,
    getTotalAuthorsCount,
    getAuthorById,
    updateAuthorPermissions,
    getAuthorArticles,
  };
};
