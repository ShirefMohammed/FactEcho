import { AxiosInstance } from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { axiosPrivate } from "../api/axios";
import { StoreState } from "../store/store";
import { httpStatusText } from "../utils/httpStatusText";
import { useLogout, useRefreshToken } from "./";

/**
 * Custom hook to handle private Axios requests with automatic token management.
 * It adds the Authorization header to the request if missing, handles token
 * expiration by refreshing the access token, and handles errors related to
 * expired tokens by logging out the user if the refresh token is also expired.
 *
 * @returns {AxiosInstance} - The customized Axios instance with interceptors.
 */
const useAxiosPrivate = (): AxiosInstance => {
  // Access token from the Redux store
  const accessToken = useSelector((state: StoreState) => state.accessToken);

  // Custom hooks for refreshing tokens and logging out
  const refresh = useRefreshToken();
  const logout = useLogout();

  useEffect(() => {
    // Request interceptor to add Authorization header if missing
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        // Add Authorization header if not already set
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      // Reject the request if an error occurs during the interception
      (error) => Promise.reject(error),
    );

    // Response interceptor to handle expired tokens and refresh the token
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        // Check if the error is related to expired access token (401 status)
        if (
          error?.response?.status === 401 &&
          error?.response?.data?.status === httpStatusText.AccessTokenExpiredError &&
          !prevRequest?.sent
        ) {
          try {
            // Mark the request as 'sent' to avoid infinite loops
            prevRequest.sent = true;

            // Try to refresh the access token
            const newAccessToken = await refresh();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

            // Retry the original request with the new access token
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            // If refresh token is expired, log out the user
            if (
              refreshError?.response?.status === 401 &&
              refreshError?.response?.data?.status === httpStatusText.RefreshTokenExpiredError
            ) {
              logout();
            }
          }
        }

        // Reject the error if it doesn't match the criteria
        return Promise.reject(error);
      },
    );

    // Cleanup function to eject interceptors when the component is unmounted
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refresh, logout]);

  // Return the customized Axios instance
  return axiosPrivate;
};

export default useAxiosPrivate;
