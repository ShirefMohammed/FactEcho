"use client";

import { useRouter } from "next/navigation";

interface NetworkError extends Error {
  response?: { status?: number };
}

/**
 * Custom hook for handling various HTTP errors and navigating to appropriate error pages.
 * It intercepts specific error statuses (e.g., 401, 403, 404, 500) and redirects the user
 * to corresponding error pages.
 *
 * @returns {Function} - A function to handle errors by checking status codes and navigating.
 */
const useHandleErrors = (): ((err: NetworkError) => void) => {
  const router = useRouter();

  const handleNoServerResponse = (err: NetworkError) => {
    if (!err?.response) {
      // Redirect to no-server-response page with current path as query parameter
      router.replace(`/no-server-response?from=${encodeURIComponent(window.location.pathname)}`);
    }
  };

  const handleServerError = (err: NetworkError) => {
    if (err?.response?.status === 500) {
      router.replace(`/server-error?from=${encodeURIComponent(window.location.pathname)}`);
    }
  };

  const handleUnauthorized = (err: NetworkError) => {
    if (err?.response?.status === 401) {
      router.replace(`/unauthorized?from=${encodeURIComponent(window.location.pathname)}`);
    }
  };

  const handleForbidden = (err: NetworkError) => {
    if (err?.response?.status === 403) {
      router.replace(`/forbidden?from=${encodeURIComponent(window.location.pathname)}`);
    }
  };

  const handleNoResourceFound = (err: NetworkError) => {
    if (err?.response?.status === 404) {
      router.replace(`/no-resource-found?from=${encodeURIComponent(window.location.pathname)}`);
    }
  };

  const handleErrors = (err: NetworkError) => {
    handleNoServerResponse(err);
    handleServerError(err);
    handleUnauthorized(err);
    handleForbidden(err);
    handleNoResourceFound(err);
  };

  return handleErrors;
};

export default useHandleErrors;
