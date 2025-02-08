import {
  ApiBodyResponse,
  ForgetPasswordRequest,
  ForgetPasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from "@shared/types/apiTypes";

import { axiosPrivate } from "../axios";
import { endPoints } from "../endPoints";

/**
 * Custom hook for authentication-related API requests.
 * Provides methods for user registration, login, logout, password recovery, and social logins.
 *
 * @returns An object containing functions for handling authentication requests.
 */
export const useAuthAPIs = () => {
  /**
   * Registers a new user.
   *
   * @param {RegisterRequest} data - The registration details.
   * @returns {Promise<ApiBodyResponse<RegisterResponse>>} - A promise that resolves to the API response.
   */
  const register = async (data: RegisterRequest): Promise<ApiBodyResponse<RegisterResponse>> => {
    const response = await axiosPrivate.post(endPoints.auth.register, data);
    return response.data;
  };

  /**
   * Logs a user in.
   *
   * @param {LoginRequest} data - The login credentials.
   * @returns {Promise<ApiBodyResponse<LoginResponse>>} - A promise that resolves to the API response.
   */
  const login = async (data: LoginRequest): Promise<ApiBodyResponse<LoginResponse>> => {
    const response = await axiosPrivate.post(endPoints.auth.login, data);
    return response.data;
  };

  /**
   * Refreshes the authentication token.
   *
   * @returns {Promise<ApiBodyResponse<RefreshResponse>>} - A promise that resolves to the API response.
   */
  const refresh = async (): Promise<ApiBodyResponse<RefreshResponse>> => {
    const response = await axiosPrivate.get(endPoints.auth.refresh);
    return response.data;
  };

  /**
   * Logs the current user out.
   *
   * @returns {Promise<ApiBodyResponse<LogoutResponse>>} - A promise that resolves to the API response.
   */
  const logout = async (): Promise<ApiBodyResponse<LogoutResponse>> => {
    const response = await axiosPrivate.get(endPoints.auth.logout);
    return response.data;
  };

  /**
   * Initiates a password reset request.
   *
   * @param {ForgetPasswordRequest} data - The email or username for the password recovery.
   * @returns {Promise<ApiBodyResponse<ForgetPasswordResponse>>} - A promise that resolves to the API response.
   */
  const forgetPassword = async (
    data: ForgetPasswordRequest,
  ): Promise<ApiBodyResponse<ForgetPasswordResponse>> => {
    const response = await axiosPrivate.post(endPoints.auth.forgetPassword, data);
    return response.data;
  };

  // Return all the authentication API functions.
  return { register, login, refresh, logout, forgetPassword };
};
