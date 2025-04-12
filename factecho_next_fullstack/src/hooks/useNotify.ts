"use client";

import { ToastOptions, toast } from "react-toastify";

type Status = "success" | "info" | "error" | "normal";

/**
 * Custom hook for displaying notifications using react-toastify.
 * This hook provides a `notify` function to show different types of toast messages (success, info, error, or normal).
 * It uses pre-defined options for positioning, auto-close time, and other behavior settings.
 *
 * @returns {Function} - A function that shows a toast notification with the specified status and message.
 */
const useNotify = (): ((status: Status, message: string) => void) => {
  // Default configuration for toast notifications
  const toastOptions: ToastOptions = {
    position: "top-right", // Position of the toast
    autoClose: 5000, // Duration for the toast to auto-close
    hideProgressBar: false, // Display progress bar
    closeOnClick: true, // Close the toast on click
    pauseOnHover: true, // Pause toast progress when hovered
    draggable: true, // Allow dragging the toast
    progress: undefined, // No custom progress bar
    theme: "light", // Theme of the toast
  };

  /**
   * Displays a toast notification with the specified status and message.
   *
   * @param {(Status)} status - The type of notification to display.
   * @param {string} message - The message to be displayed in the toast notification.
   * @returns {void} - This function does not return any value.
   */
  const notify = (status: Status, message: string): void => {
    if (status === "success") {
      toast.success(message, toastOptions); // Show success toast
    } else if (status === "info") {
      toast.info(message, toastOptions); // Show info toast
    } else if (status === "error") {
      toast.error(message, toastOptions); // Show error toast
    } else if (status === "normal") {
      toast(message, toastOptions); // Show normal toast (no specific style)
    }
  };

  return notify;
};

export default useNotify;
