import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ApiBodyResponse, GetArticlesResponse } from "@shared/types/apiTypes";
import { IArticle, ICategory } from "@shared/types/entitiesTypes";

import { useCategoriesAPIs } from "../../api/hooks/useCategoriesAPIs";
import { ArticlesGrid } from "../../components";
import { useHandleErrors } from "../../hooks";

const CategoryArticles = () => {
  const limit = 15; // Number of articles to fetch per page

  const { categoryId } = useParams(); // Extract categoryId parameter

  const [category, setCategory] = useState<ICategory | null>(null); // State to hold the category object
  const [articles, setArticles] = useState<IArticle[]>([]); // Holds the list of articles fetched from the API
  const [fetchCategoryArticlesLoad, setFetchCategoryArticlesLoad] = useState<boolean>(false); // Tracks the loading state of the API call
  const [articlesPage, setArticlesPage] = useState<number>(1); // Article page for loading more articles

  const handleErrors = useHandleErrors(); // Hook to manage API error handling
  const categoriesAPIs = useCategoriesAPIs(); // Provides API methods related to articles

  /**
   * Fetch current category data
   */
  const fetchCategory = async (): Promise<void> => {
    try {
      // Call the API to update a new article
      const resBody = await categoriesAPIs.getCategoryById(categoryId!);
      setCategory(resBody.data?.category as ICategory);
    } catch (err: any) {
      handleErrors(err);
    }
  };

  /**
   * Fetches articles based on the categoryId, current page, and limit.
   * Updates the articles state on successful fetch or handles errors when the API call fails.
   */
  const fetchCategoryArticles = async () => {
    try {
      setFetchCategoryArticlesLoad(true);
      const resBody: ApiBodyResponse<GetArticlesResponse> =
        await categoriesAPIs.getCategoryArticles(categoryId!, articlesPage, limit, "new");
      setArticles((prevArticles) => [...prevArticles, ...(resBody.data?.articles || [])]);
    } catch (err) {
      handleErrors(err);
    } finally {
      setFetchCategoryArticlesLoad(false);
    }
  };

  // Fetches category whenever the categoryId changes.
  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  // Fetches category articles whenever the categoryId or articlesPage changes.
  useEffect(() => {
    fetchCategoryArticles();
  }, [categoryId, articlesPage]);

  return (
    <ArticlesGrid
      title={`مقالات عن ${category?.title || ""}`}
      isLoading={fetchCategoryArticlesLoad}
      setIsLoading={setFetchCategoryArticlesLoad}
      articles={articles}
      displayFields={["title", "image", "views", "created_at"]}
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
