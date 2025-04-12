"use client";

import { articlesAPIs } from "@/axios/apis/articlesAPIs";
import { ArticlesGrid } from "@/components";
import { useHandleErrors, useQuery } from "@/hooks";
import { ApiBodyResponse, GetArticlesResponse } from "@/types/apiTypes";
import { IArticle } from "@/types/entitiesTypes";
import { useEffect, useState } from "react";

const SearchArticles = () => {
  const limit = 15;
  const { searchKey } = useQuery();

  const [articles, setArticles] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleErrors = useHandleErrors();

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
      handleErrors(err as Error);
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
      displayFields={["title", "image", "views", "created_at", "creator_id"]}
    />
  );
};

export default SearchArticles;
