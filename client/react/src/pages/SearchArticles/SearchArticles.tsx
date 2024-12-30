import { useEffect, useState } from "react";

import { ApiBodyResponse, GetArticlesResponse } from "@shared/types/apiTypes";
import { IArticle } from "@shared/types/entitiesTypes";

import { useArticlesAPIs } from "../../api/hooks/useArticlesAPIs";
import { ArticlesGrid } from "../../components";
import { useHandleErrors, useQuery } from "../../hooks";

const SearchArticles = () => {
  const limit = 15; // Number of articles to fetch per page
  const { searchKey } = useQuery(); // Extract searchKey parameter from query URL

  const [articles, setArticles] = useState<IArticle[]>([]); // Holds the list of articles fetched from the API
  const [isLoading, setIsLoading] = useState<boolean>(false); // Tracks the loading state of the API call

  const handleErrors = useHandleErrors(); // Hook to manage API error handling
  const articlesAPIs = useArticlesAPIs(); // Provides API methods related to articles

  /**
   * Fetches articles based on the search key, current page, and limit.
   * Updates the articles state on successful fetch or handles errors when the API call fails.
   */
  const searchArticles = async () => {
    try {
      setIsLoading(true);
      const resBody: ApiBodyResponse<GetArticlesResponse> = await articlesAPIs.searchArticles(
        searchKey,
        1,
        limit,
        "new",
      );
      setArticles(resBody.data?.articles || []);
    } catch (err) {
      handleErrors(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetches articles whenever the searchKey changes.
  useEffect(() => {
    searchArticles();
  }, [searchKey]);

  return (
    <ArticlesGrid
      title="نتائج البحث"
      isLoading={isLoading}
      articles={articles}
      displayFields={["title", "image", "views", "created_at"]}
    />
  );
};

export default SearchArticles;
