import {
  ApiBodyResponse,
  CheckUserExistenceRequest,
  CheckUserExistenceResponse,
  ForgetPasswordRequest,
  ForgetPasswordResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyAccountRequest,
  VerifyAccountResponse,
} from "@/types/apiTypes";

import { axiosPrivate } from "../axios";
import { endPoints } from "../endPoints";

/**
 * Server-side utility class for handling API requests related to auth.
 * Designed for use in Next.js server components and server actions.
 */
export class AuthAPIs {
  /**
   * Registers a new user.
   *
   * @param {RegisterRequest} data - The registration details.
   * @returns {Promise<ApiBodyResponse<RegisterResponse>>} - The registration response.
   */
  async register(data: RegisterRequest): Promise<ApiBodyResponse<RegisterResponse>> {
    const response = await axiosPrivate.post(endPoints.auth.register, data);
    return response.data;
  }

  /**
   * Verify account request.
   *
   * @param {VerifyAccountRequest} data - The verificationToken.
   * @returns {Promise<ApiBodyResponse<VerifyAccountResponse>>} - The verification response.
   */
  async verifyAccount(data: VerifyAccountRequest): Promise<ApiBodyResponse<VerifyAccountResponse>> {
    const response = await axiosPrivate.post(endPoints.auth.verifyAccount, data);
    return response.data;
  }

  /**
   * Initiates a password reset request.
   *
   * @param {ForgetPasswordRequest} data - The email or username for password recovery.
   * @returns {Promise<ApiBodyResponse<ForgetPasswordResponse>>} - The password reset response.
   */
  async forgetPassword(
    data: ForgetPasswordRequest,
  ): Promise<ApiBodyResponse<ForgetPasswordResponse>> {
    const response = await axiosPrivate.post(endPoints.auth.forgetPassword, data);
    return response.data;
  }

  /**
   * Reset password request.
   *
   * @param {ResetPasswordRequest} data - The resetPasswordToken or newPassword for reset password.
   * @returns {Promise<ApiBodyResponse<ResetPasswordResponse>>} - The password reset response.
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiBodyResponse<ResetPasswordResponse>> {
    const response = await axiosPrivate.post(endPoints.auth.resetPassword, data);
    return response.data;
  }

  /**
   * Checks if a user exists and has the correct role.
   *
   * @param {CheckUserExistenceRequest} data - The user_id and role to verify.
   * @returns {Promise<ApiBodyResponse<CheckUserExistenceResponse>>} - The verification response.
   */
  async checkUserExistence(
    data: CheckUserExistenceRequest,
  ): Promise<ApiBodyResponse<CheckUserExistenceResponse>> {
    const response = await axiosPrivate.post(endPoints.auth.checkUserExistence, data);
    return response.data;
  }
}

export const authAPIs = new AuthAPIs();
