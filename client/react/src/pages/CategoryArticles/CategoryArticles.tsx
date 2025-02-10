import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ApiBodyResponse, GetCategoryArticlesResponse } from "@shared/types/apiTypes";
import { IArticle, ICategory } from "@shared/types/entitiesTypes";

import { useCategoriesAPIs } from "../../api/hooks/useCategoriesAPIs";
import { ArticlesGrid } from "../../components";
import { useHandleErrors } from "../../hooks";

const CategoryArticles = () => {
  const limit = 15;

  const { categoryId } = useParams(); // Extract categoryId parameter

  const [category, setCategory] = useState<ICategory | null>(null); // State to hold the category object
  const [articles, setArticles] = useState<IArticle[]>([]); // Holds the list of articles fetched from the API
  const [isLoading, setIsLoading] = useState<boolean>(false); // Tracks the loading state of the API call

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
      setIsLoading(true);
      const resBody: ApiBodyResponse<GetCategoryArticlesResponse> =
        await categoriesAPIs.getCategoryArticles(categoryId!, 1, limit, "new");
      setArticles(resBody.data?.articles || []);
    } catch (err) {
      handleErrors(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetches category and its articles whenever the categoryId changes.
  useEffect(() => {
    fetchCategory();
    fetchCategoryArticles();
  }, [categoryId]);

  return (
    <ArticlesGrid
      title={`مقالات عن ${category?.title || ""}`}
      isLoading={isLoading}
      articles={articles}
      displayFields={["title", "image", "views", "created_at", "creator_id"]}
    />
  );
};

export default CategoryArticles;
