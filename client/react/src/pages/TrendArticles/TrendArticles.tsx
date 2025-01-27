import { useEffect, useState } from "react";

import { ApiBodyResponse, GetArticlesResponse } from "@shared/types/apiTypes";
import { IArticle } from "@shared/types/entitiesTypes";

import { useArticlesAPIs } from "../../api/hooks/useArticlesAPIs";
import { ArticlesGrid } from "../../components";
import { useHandleErrors } from "../../hooks";

const TrendArticles = () => {
  const limit = 15; // Number of articles to fetch per page

  const [articles, setArticles] = useState<IArticle[]>([]); // Holds the list of articles fetched from the API
  const [isLoading, setIsLoading] = useState<boolean>(false); // Tracks the loading state of the API call

  const handleErrors = useHandleErrors(); // Hook to manage API error handling
  const articlesAPIs = useArticlesAPIs(); // Provides API methods related to articles

  /**
   * Fetches the trend articles from the API.
   * Limits the number of articles based on the defined limit.
   * Updates the articles state on success or handles errors if the call fails.
   */
  const fetchTrendArticles = async () => {
    try {
      setIsLoading(true); // Start loading
      const resBody: ApiBodyResponse<GetArticlesResponse> =
        await articlesAPIs.getTrendArticles(limit);
      setArticles(resBody.data?.articles || []); // Update state with fetched articles
    } catch (err) {
      handleErrors(err); // Handle errors with the custom hook
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Fetch articles when the component is mounted
  useEffect(() => {
    fetchTrendArticles();
  }, []);

  return (
    <ArticlesGrid
      title="المقالات الرائجة"
      isLoading={isLoading}
      articles={articles}
      displayFields={["title", "image", "views", "created_at", "creator_id"]}
    />
  );
};

export default TrendArticles;
