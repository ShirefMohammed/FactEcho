import { memo, useEffect, useState } from "react";

import { ApiBodyResponse, GetArticlesResponse } from "@shared/types/apiTypes";
import { IArticle } from "@shared/types/entitiesTypes";

import { useArticlesAPIs } from "../../../api/hooks/useArticlesAPIs";
import { ArticlesGrid } from "../../../components";
import { useHandleErrors } from "../../../hooks";

const TrendArticlesSection = memo(() => {
  // State to store the fetched articles
  const [articles, setArticles] = useState<IArticle[]>([]);
  // State to track the loading status of the API call
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Custom hook to handle API errors
  const handleErrors = useHandleErrors();
  // API methods for articles
  const articlesAPIs = useArticlesAPIs();

  /**
   * Fetches trend articles from the API with a specific page, limit, and sort order.
   * Updates the state with the fetched articles or handles errors on failure.
   */
  const fetchTrendArticles = async () => {
    try {
      setIsLoading(true); // Indicate loading state
      const resBody: ApiBodyResponse<GetArticlesResponse> = await articlesAPIs.getTrendArticles(4);
      setArticles(resBody.data?.articles || []); // Safely set the articles
    } catch (err) {
      handleErrors(err); // Handle any errors using the custom hook
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Trigger the fetchTrendArticles function once when the component mounts
  useEffect(() => {
    fetchTrendArticles();
  }, []);

  return (
    <ArticlesGrid
      title="المقالات الرائجة"
      isLoading={isLoading}
      articles={articles}
      displayFields={["title", "image", "views", "created_at"]}
      gridClassName="grid gap-4 md:grid-cols-2"
    />
  );
});

export default TrendArticlesSection;
