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
 * Class for handling authentication-related API requests.
 */
export class AuthAPI {
  /**
   * Registers a new user.
   *
   * @param {RegisterRequest} data - The registration details.
   * @returns {Promise<ApiBodyResponse<RegisterResponse>>} - The registration response.
   */
  static async register(
    data: RegisterRequest
  ): Promise<ApiBodyResponse<RegisterResponse>> {
    const response = await axiosPrivate.post(endPoints.auth.register, data);
    return response.data;
  }

  /**
   * Logs a user in.
   *
   * @param {LoginRequest} data - The login credentials.
   * @returns {Promise<ApiBodyResponse<LoginResponse>>} - The login response.
   */
  static async login(
    data: LoginRequest
  ): Promise<ApiBodyResponse<LoginResponse>> {
    const response = await axiosPrivate.post(endPoints.auth.login, data);
    return response.data;
  }

  /**
   * Refreshes the authentication token.
   *
   * @returns {Promise<ApiBodyResponse<RefreshResponse>>} - The token refresh response.
   */
  static async refresh(): Promise<ApiBodyResponse<RefreshResponse>> {
    const response = await axiosPrivate.get(endPoints.auth.refresh);
    return response.data;
  }

  /**
   * Logs the current user out.
   *
   * @returns {Promise<ApiBodyResponse<LogoutResponse>>} - The logout response.
   */
  static async logout(): Promise<ApiBodyResponse<LogoutResponse>> {
    const response = await axiosPrivate.get(endPoints.auth.logout);
    return response.data;
  }

  /**
   * Initiates a password reset request.
   *
   * @param {ForgetPasswordRequest} data - The email or username for password recovery.
   * @returns {Promise<ApiBodyResponse<ForgetPasswordResponse>>} - The password reset response.
   */
  static async forgetPassword(
    data: ForgetPasswordRequest
  ): Promise<ApiBodyResponse<ForgetPasswordResponse>> {
    const response = await axiosPrivate.post(endPoints.auth.forgetPassword, data);
    return response.data;
  }
}
