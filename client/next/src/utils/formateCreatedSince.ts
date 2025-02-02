/**
 * Formats the time elapsed since the provided timestamp into a human-readable string.
 *
 * @param {string} createdAt - The ISO 8601 timestamp string (e.g., "2024-12-23T18:13:08.017Z").
 * @returns {string} A human-readable string indicating the time elapsed (e.g., "5 days ago", "just now").
 *
 * @example
 * // For a timestamp representing 5 minutes ago:
 * formatCreatedSince(new Date(Date.now() - 5 * 60 * 1000).toISOString());
 * // Output: "5 minutes ago"
 *
 * @example
 * // For a timestamp representing a year ago:
 * formatCreatedSince(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());
 * // Output: "1 year ago"
 */
export const formatCreatedSince = (createdAt: string): string => {
  const now = new Date().getTime(); // Current timestamp in milliseconds
  const created = new Date(createdAt).getTime(); // Parse the ISO timestamp to milliseconds
  const diff = now - created; // Difference between now and the created timestamp
  const seconds = Math.floor(diff / 1000); // Convert to seconds
  const minutes = Math.floor(seconds / 60); // Convert to minutes
  const hours = Math.floor(minutes / 60); // Convert to hours
  const days = Math.floor(hours / 24); // Convert to days
  const weeks = Math.floor(days / 7); // Convert to weeks
  const months = Math.floor(days / 30); // Approximate months
  const years = Math.floor(days / 365); // Approximate years

  if (years > 0) {
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  } else if (months > 0) {
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  } else if (weeks > 0) {
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else {
    return `just now`;
  }
};
