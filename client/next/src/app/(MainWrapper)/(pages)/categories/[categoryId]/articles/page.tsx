"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ApiBodyResponse, GetCategoryArticlesResponse } from "shared/types/apiTypes";
import { IArticle, ICategory } from "shared/types/entitiesTypes";

import { useCategoriesAPIs } from "../../../../../../api/client/useCategoriesAPIs";
import { ArticlesGrid } from "../../../../../../components";
import { useHandleErrors } from "../../../../../../hooks";

/**
 * Component to display articles of a specific category.
 * Fetches and displays articles with pagination and loading states.
 */
const CategoryArticles = () => {
  const limit = 15; // Number of articles to fetch per page
  const { categoryId } = useParams<{ categoryId: string }>(); // Extract categoryId from URL

  const [category, setCategory] = useState<ICategory | null>(null); // Holds category data
  const [articles, setArticles] = useState<IArticle[]>([]); // Holds fetched articles
  const [fetchCategoryArticlesLoad, setFetchCategoryArticlesLoad] = useState<boolean>(false); // Loading state
  const [articlesPage, setArticlesPage] = useState<number>(1); // Pagination state

  const handleErrors = useHandleErrors(); // Hook to manage API error handling
  const categoriesAPIs = useCategoriesAPIs(); // API methods related to categories

  const isFirstRender = useRef(true); // Track first render to avoid duplicate API calls

  /** Fetch category details */
  const fetchCategory = async (): Promise<void> => {
    try {
      const resBody = await categoriesAPIs.getCategoryById(categoryId!);
      setCategory(resBody.data?.category as ICategory);
    } catch (err) {
      handleErrors(err as Error);
    }
  };

  /** Fetch category articles with pagination */
  const fetchCategoryArticles = async () => {
    try {
      setFetchCategoryArticlesLoad(true);
      const resBody: ApiBodyResponse<GetCategoryArticlesResponse> =
        await categoriesAPIs.getCategoryArticles(categoryId!, articlesPage, limit, "new");
      setArticles((prevArticles) => [...prevArticles, ...(resBody.data?.articles || [])]);
    } catch (err) {
      handleErrors(err as Error);
    } finally {
      setFetchCategoryArticlesLoad(false);
    }
  };

  // Fetch category details when categoryId changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchCategory();
    setArticles([]); // Reset articles on category change
    fetchCategoryArticles();
  }, [categoryId]);

  // Fetch more articles when the page changes
  useEffect(() => {
    if (articlesPage > 1) fetchCategoryArticles();
  }, [articlesPage]);

  return (
    <ArticlesGrid
      title={`مقالات عن ${category?.title || ""}`}
      isLoading={fetchCategoryArticlesLoad}
      setIsLoading={setFetchCategoryArticlesLoad}
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

export default CategoryArticles;
