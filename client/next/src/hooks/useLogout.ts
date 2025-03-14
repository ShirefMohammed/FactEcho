"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { useAuthAPIs } from "../api/client/useAuthAPIs";
import { setAccessToken } from "../store/slices/accessTokenSlice";
import { setAuthReady } from "../store/slices/authStateSlice";
import { setUserAvatar } from "../store/slices/userAvatarSlice";
import { setUser } from "../store/slices/userSlice";

/**
 * Custom hook that handles logging the user out.
 * It clears the user's data and access token from the Redux store,
 * sends a logout request to the server, and navigates to the authentication page.
 *
 * @returns {Function} - A function that performs the logout operation.
 */
const useLogout = (): (() => Promise<void>) => {
  const authAPIs = useAuthAPIs();
  const dispatch = useDispatch();
  const router = useRouter();

  /**
   * Logs the user out by:
   * - Dispatching actions to reset the user's data and access token in the Redux store.
   * - Calling the logout API to notify the server.
   * - Navigating to the authentication page (`/auth`).
   *
   * @async
   * @function
   * @returns {Promise<void>} - A promise that resolves once the logout is completed.
   */
  const logout = async (): Promise<void> => {
    try {
      // Call the API to log out the user
      await authAPIs.logout();

      // Clear user data and access token from Redux store
      dispatch(setUser({}));
      dispatch(setUserAvatar(""));
      dispatch(setAccessToken(""));
      dispatch(setAuthReady(false));

      // Navigate to the auth page after logging out
      router.push("/auth");
    } catch (err) {
      console.error(err); // Log any error that occurs during the logout process
    }
  };

  return logout;
};

export default useLogout;
