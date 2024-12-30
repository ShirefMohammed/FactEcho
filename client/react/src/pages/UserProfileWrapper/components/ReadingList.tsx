import { StoreState } from "client/react/src/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { ApiBodyResponse, GetArticlesResponse } from "@shared/types/apiTypes";
import { IArticle } from "@shared/types/entitiesTypes";

import { useArticlesAPIs } from "../../../api/hooks/useArticlesAPIs";
import { ArticlesGrid } from "../../../components";
import { useHandleErrors } from "../../../hooks";

/**
 * Component to display a user's reading list.
 * Fetches and displays saved articles, handling pagination and loading states.
 */
const ReadingList = () => {
  const limit = 15; // Number of articles to fetch per page

  const currentUser = useSelector((state: StoreState) => state.currentUser); // currentUser state

  const [articles, setArticles] = useState<IArticle[]>([]); // Holds the list of articles fetched from the API
  const [fetchReadingListArticlesLoad, setFetchReadingListArticlesLoad] = useState<boolean>(false); // Tracks the loading state of the API call
  const [articlesPage, setArticlesPage] = useState<number>(1); // Article page for loading more articles

  const handleErrors = useHandleErrors(); // Hook to manage API error handling
  const articlesAPIs = useArticlesAPIs(); // Provides API methods related to articles

  /**
   * Fetches saved articles for the user based on the current page and limit.
   * Updates the articles state on successful fetch or handles errors on failure.
   */
  const fetchReadingList = async () => {
    try {
      setFetchReadingListArticlesLoad(true);
      const resBody: ApiBodyResponse<GetArticlesResponse> = await articlesAPIs.getSavedArticles(
        articlesPage,
        limit,
        "new",
      );
      setArticles((prevArticles) => [
        ...prevArticles,
        ...(resBody.data?.articles || []), // Append new articles to the existing list
      ]);
    } catch (err) {
      handleErrors(err);
    } finally {
      setFetchReadingListArticlesLoad(false);
    }
  };

  useEffect(() => {
    setArticles([]); // Clear articles when userId changes
    fetchReadingList(); // Fetch the first page of articles for the new userId
  }, [currentUser.user_id]);

  useEffect(() => {
    if (articlesPage > 1) fetchReadingList(); // Fetch more articles when the page changes
  }, [articlesPage]);

  return (
    <ArticlesGrid
      isLoading={fetchReadingListArticlesLoad}
      setIsLoading={setFetchReadingListArticlesLoad}
      articles={articles}
      displayFields={["title", "image", "views", "created_at"]}
      gridClassName="grid gap-4 md:grid-cols-2"
      btn={{
        articlesLength: articles.length,
        limit: limit,
        page: articlesPage,
        setPage: setArticlesPage,
      }}
    />
  );
};

export default ReadingList;
