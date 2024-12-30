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
