/**
 * Format a timestamp (e.g., created_at, updated_at) to a human-readable date and time.
 * @param {string} timestamp - Timestamp string from the database.
 * @returns {string} Formatted date and time.
 */
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp); // Parses the database timestamp
  return date.toLocaleString(); // Returns a local human-readable format
};
