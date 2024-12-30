import { useLocation, useNavigate } from "react-router-dom";

interface NetworkError extends Error {
  response?: any;
}

/**
 * Custom hook for handling various HTTP errors and navigating to appropriate error pages.
 * It intercepts specific error statuses (e.g., 401, 403, 404, 500) and redirects the user
 * to corresponding error pages.
 *
 * @returns {Function} - A function to handle errors by checking status codes and navigating.
 */
const useHandleErrors = (): ((err: NetworkError) => void) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNoServerResponse = (err: NetworkError) => {
    if (!err?.response) {
      navigate("/no-server-response", {
        state: { from: location },
        replace: true,
      });
    }
  };

  const handleServerError = (err: NetworkError) => {
    if (err?.response?.status === 500) {
      navigate("/server-error", { state: { from: location }, replace: true });
    }
  };

  const handleUnauthorized = (err: NetworkError) => {
    if (err?.response?.status === 401) {
      navigate("/unauthorized", { state: { from: location }, replace: true });
    }
  };

  const handleForbidden = (err: NetworkError) => {
    if (err?.response?.status === 403) {
      navigate("/forbidden", { state: { from: location }, replace: true });
    }
  };

  const handleNoResourceFound = (err: NetworkError) => {
    if (err?.response?.status === 404) {
      navigate("/no-resource-found", {
        state: { from: location },
        replace: true,
      });
    }
  };

  const handleErrors = (err: NetworkError) => {
    handleNoServerResponse(err);
    handleServerError(err);
    handleUnauthorized(err);
    handleForbidden(err);
    handleNoResourceFound(err);
  };

  // Return the main error handling function
  return handleErrors;
};

export default useHandleErrors;
