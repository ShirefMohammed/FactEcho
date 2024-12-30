import { useDispatch } from "react-redux";

import { RefreshResponse } from "@shared/types/apiTypes";

import { useAuthAPIs } from "../api/hooks/useAuthAPIs";
import { setAccessToken } from "../store/slices/accessTokenSlice";
import { setUser } from "../store/slices/userSlice";

/**
 * Custom hook for refreshing the user's authentication token.
 * This hook makes an API request to refresh the user's access token and updates the Redux store
 * with the new user data and access token.
 *
 * @returns {Function} - A function that performs the refresh operation and returns the new access token.
 */
const useRefreshToken = (): (() => Promise<string>) => {
  const authAPIs = useAuthAPIs();
  const dispatch = useDispatch();

  /**
   * Refreshes the authentication token by making an API call to the server.
   * If the request is successful, the hook dispatches actions to update the user data and access token
   * in the Redux store.
   *
   * @async
   * @returns {Promise<string>} - The new access token after the refresh.
   * @throws {Error} - Throws an error if the refresh API request fails.
   */
  const refresh = async (): Promise<string> => {
    // Call the refresh API to get a new access token and user data
    const bodyResponse = await authAPIs.refresh();

    // Destructure the response data to get the user and access token
    const resData: RefreshResponse = bodyResponse?.data as RefreshResponse;

    // Dispatch the user and access token to the Redux store
    dispatch(setUser(resData.user));
    dispatch(setAccessToken(resData.accessToken));

    // Return the new access token
    return resData.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
