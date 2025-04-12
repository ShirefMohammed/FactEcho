"use client";

import { signOut } from "next-auth/react";

/**
 * Custom hook that handles logging the user out.
 * sends a logout request to the server, and navigates to the authentication page.
 *
 * @returns {Function} - A function that performs the logout operation.
 */
const useLogout = (): (() => Promise<void>) => {
  /**
   * Logs the user out by:
   * - Calling the signOut API to notify the server.
   * - Navigating to the authentication page (`/auth`).
   *
   * @async
   * @function
   * @returns {Promise<void>} - A promise that resolves once the logout is completed.
   */
  const logout = async (): Promise<void> => {
    signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  return logout;
};

export default useLogout;
