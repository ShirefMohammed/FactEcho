"use client";

import { useEffect, useState } from "react";

import { ApiBodyResponse, GetArticlesResponse } from "@shared/types/apiTypes";
import { IArticle, IAuthor } from "@shared/types/entitiesTypes";

import { useAuthorsAPIs } from "../../../../../../api/client/useAuthorsAPIs";
import { ArticlesGrid } from "../../../../../../components";
import { useHandleErrors } from "../../../../../../hooks";

const AuthorArticles = ({ authorId }: { authorId: IAuthor["user_id"] }) => {
  const limit = 15; // Number of articles to fetch per page

  const [articles, setArticles] = useState<IArticle[]>([]); // Holds the list of articles fetched from the API
  const [fetchAuthorArticlesLoad, setFetchAuthorArticlesLoad] = useState<boolean>(false); // Tracks the loading state of the API call
  const [articlesPage, setArticlesPage] = useState<number>(1); // Article page for loading more articles

  const handleErrors = useHandleErrors(); // Hook to manage API error handling
  const authorsAPIs = useAuthorsAPIs(); // Provides API methods related to authors

  /**
   * Fetches articles written by the specified author based on the authorId, current page, and limit.
   * Updates the articles state on successful fetch or handles errors when the API call fails.
   */
  const fetchAuthorArticles = async () => {
    try {
      setFetchAuthorArticlesLoad(true);
      const resBody: ApiBodyResponse<GetArticlesResponse> = await authorsAPIs.getAuthorArticles(
        authorId,
        articlesPage,
        limit,
        "new",
      );
      setArticles((prevArticles) => [...prevArticles, ...(resBody.data?.articles || [])]);
    } catch (err) {
      handleErrors(err as Error);
    } finally {
      setFetchAuthorArticlesLoad(false);
    }
  };

  // Reset and fetches articles whenever the authorId changes.
  useEffect(() => {
    setArticles([]);
    fetchAuthorArticles();
  }, [authorId]);

  // Fetches articles whenever the articlesPage changes.
  useEffect(() => {
    if (articlesPage > 1) fetchAuthorArticles();
  }, [articlesPage]);

  return (
    <ArticlesGrid
      title={`الجديد من الكاتب`}
      isLoading={fetchAuthorArticlesLoad}
      setIsLoading={setFetchAuthorArticlesLoad}
      articles={articles}
      displayFields={["title", "image", "views", "created_at", "creator_id"]}
      btn={{
        articlesLength: articles.length,
        limit: limit,
        page: articlesPage,
        setPage: setArticlesPage,
      }}
    />
  );
};

export default AuthorArticles;
