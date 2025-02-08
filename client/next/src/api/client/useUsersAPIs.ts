import {
  ApiBodyResponse,
  CleanupUnverifiedUsersResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  GetTotalUsersCountResponse,
  GetUserResponse,
  GetUsersResponse,
  SearchUsersResponse,
  UpdateUserAvatarRequest,
  UpdateUserAvatarResponse,
  UpdateUserDetailsRequest,
  UpdateUserDetailsResponse,
  UpdateUserPasswordRequest,
  UpdateUserPasswordResponse,
  UpdateUserRoleRequest,
  UpdateUserRoleResponse,
} from "@shared/types/apiTypes";

import { useAxiosPrivate } from "../../hooks";
import { endPoints } from "../endPoints";

/**
 * Custom hook for user-related API requests with parameterized methods.
 * Provides functions for fetching user data, searching, updating details, and more.
 *
 * @returns An object with methods for user-related API actions.
 */
export const useUsersAPIs = () => {
  const axiosPrivate = useAxiosPrivate();

  /**
   * Fetches users with pagination.
   *
   * @param {number} page - The page number for pagination.
   * @param {number} limit - The number of users to fetch per page.
   * @returns {Promise<ApiBodyResponse<GetUsersResponse>>} - The list of users.
   */
  const getUsers = async (
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiBodyResponse<GetUsersResponse>> => {
    const response = await axiosPrivate.get(endPoints.users.getAll, {
      params: { page, limit },
    });
    return response.data;
  };

  /**
   * Searches users based on a query string with pagination.
   *
   * @param {string} searchKey - The search query for filtering users.
   * @param {number} page - The page number for pagination.
   * @param {number} limit - The number of users to fetch per page.
   * @returns {Promise<ApiBodyResponse<SearchUsersResponse>>} - The search results.
   */
  const searchUsers = async (
    searchKey: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiBodyResponse<SearchUsersResponse>> => {
    const response = await axiosPrivate.get(endPoints.users.search, {
      params: { searchKey, page, limit },
    });
    return response.data;
  };

  /**
   * Gets the total count of users.
   *
   * @returns {Promise<ApiBodyResponse<GetTotalUsersCountResponse>>} - The total user count.
   */
  const getTotalUsersCount = async (): Promise<ApiBodyResponse<GetTotalUsersCountResponse>> => {
    const response = await axiosPrivate.get(endPoints.users.count);
    return response.data;
  };

  /**
   * Deletes unverified users.
   *
   * @returns {Promise<ApiBodyResponse<CleanupUnverifiedUsersResponse>>} - The cleanup result.
   */
  const cleanupUnverifiedUsers = async (): Promise<
    ApiBodyResponse<CleanupUnverifiedUsersResponse>
  > => {
    const response = await axiosPrivate.delete(endPoints.users.unverifiedCleanup);
    return response.data;
  };

  /**
   * Gets a single user's details by their ID.
   *
   * @param {string} userId - The ID of the user to fetch.
   * @returns {Promise<ApiBodyResponse<GetUserResponse>>} - The user's details.
   */
  const getUserById = async (userId: string): Promise<ApiBodyResponse<GetUserResponse>> => {
    const response = await axiosPrivate.get(endPoints.users.getById(userId));
    return response.data;
  };

  /**
   * Deletes a user by their ID and optional password.
   *
   * @param {string} userId - The ID of the user to delete.
   * @param {DeleteUserRequest} data - The password or data for user deletion.
   * @returns {Promise<ApiBodyResponse<DeleteUserResponse>>} - The result of the deletion.
   */
  const deleteUser = async (
    userId: string,
    data: DeleteUserRequest,
  ): Promise<ApiBodyResponse<DeleteUserResponse>> => {
    const response = await axiosPrivate.delete(endPoints.users.deleteById(userId), { data });
    return response.data;
  };

  /**
   * Updates a user's details.
   *
   * @param {string} userId - The ID of the user to update.
   * @param {UpdateUserDetailsRequest} data - The data to update for the user.
   * @returns {Promise<ApiBodyResponse<UpdateUserDetailsResponse>>} - The result of the update.
   */
  const updateUserDetails = async (
    userId: string,
    data: UpdateUserDetailsRequest,
  ): Promise<ApiBodyResponse<UpdateUserDetailsResponse>> => {
    const response = await axiosPrivate.patch(endPoints.users.updateDetails(userId), data);
    return response.data;
  };

  /**
   * Updates a user's role.
   *
   * @param {string} userId - The ID of the user whose role to update.
   * @param {UpdateUserRoleRequest} data - The new role data.
   * @returns {Promise<ApiBodyResponse<UpdateUserRoleResponse>>} - The result of the update.
   */
  const updateUserRole = async (
    userId: string,
    data: UpdateUserRoleRequest,
  ): Promise<ApiBodyResponse<UpdateUserRoleResponse>> => {
    const response = await axiosPrivate.patch(endPoints.users.updateRole(userId), data);
    return response.data;
  };

  /**
   * Updates a user's password.
   *
   * @param {string} userId - The ID of the user whose password to update.
   * @param {UpdateUserPasswordRequest} data - The new password data.
   * @returns {Promise<ApiBodyResponse<UpdateUserPasswordResponse>>} - The result of the update.
   */
  const updateUserPassword = async (
    userId: string,
    data: UpdateUserPasswordRequest,
  ): Promise<ApiBodyResponse<UpdateUserPasswordResponse>> => {
    const response = await axiosPrivate.patch(endPoints.users.updatePassword(userId), data);
    return response.data;
  };

  /**
   * Updates a user's avatar.
   *
   * @param {string} userId - The ID of the user whose avatar to update.
   * @param {UpdateUserAvatarRequest} data - The new avatar data.
   * @returns {Promise<ApiBodyResponse<UpdateUserAvatarResponse>>} - The result of the update.
   */
  const updateUserAvatar = async (
    userId: string,
    data: UpdateUserAvatarRequest,
  ): Promise<ApiBodyResponse<UpdateUserAvatarResponse>> => {
    const response = await axiosPrivate.patch(endPoints.users.updateAvatar(userId), data);
    return response.data;
  };

  return {
    getUsers,
    searchUsers,
    getTotalUsersCount,
    cleanupUnverifiedUsers,
    getUserById,
    deleteUser,
    updateUserDetails,
    updateUserRole,
    updateUserPassword,
    updateUserAvatar,
  };
};
