/**
 * Format a date string (e.g., publication date of an article) to a localized, human-readable format.
 * The format uses the Arabic locale and includes the year, month, day, hour, and minute.
 * @param {string} dateString - The date string to format (e.g., from the database).
 * @returns {string} A formatted date string in Arabic locale.
 */
export const formatArticleDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ar", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
