"use client";

import { useEffect, useState } from "react";

import {
  ApiBodyResponse,
  GetCategoriesResponse,
  GetCategoryArticlesResponse,
} from "@shared/types/apiTypes";
import { IArticle, ICategory } from "@shared/types/entitiesTypes";

import { useCategoriesAPIs } from "../../../../../api/client/useCategoriesAPIs";
import { ArticlesGrid } from "../../../../../components";
import { useHandleErrors } from "../../../../../hooks";

const CategoriesArticles = () => {
  const limit = 3;

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleErrors = useHandleErrors();
  const categoriesAPIs = useCategoriesAPIs();

  /**
   * Fetches categories from the API with a specific page, limit, and sort order.
   * Updates the state with the fetched categories or handles errors on failure.
   */
  const fetchCategories = async () => {
    try {
      setIsLoading(true); // Indicate loading state
      const resBody: ApiBodyResponse<GetCategoriesResponse> = await categoriesAPIs.getCategories(
        1,
        limit,
        "new",
      );
      setCategories(resBody.data?.categories || []);
    } catch (err) {
      handleErrors(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="w-full flex flex-col gap-8">
      {!isLoading ? (
        <>
          {categories.map((category) => (
            <CategoryArticles key={category.category_id} category={category} />
          ))}
        </>
      ) : (
        <div className="text-gray-500">جاري التحميل...</div>
      )}
    </div>
  );
};

const CategoryArticles = ({ category }: { category: ICategory }) => {
  const limit = 3;

  const [articles, setArticles] = useState<IArticle[]>([]);
  const [fetchCategoryArticlesLoad, setFetchCategoryArticlesLoad] = useState<boolean>(false);

  const handleErrors = useHandleErrors();
  const categoriesAPIs = useCategoriesAPIs();

  /**
   * Fetches articles based on the categoryId, current page, and limit.
   * Updates the articles state on successful fetch or handles errors when the API call fails.
   */
  const fetchCategoryArticles = async () => {
    try {
      setFetchCategoryArticlesLoad(true);
      const resBody: ApiBodyResponse<GetCategoryArticlesResponse> =
        await categoriesAPIs.getCategoryArticles(category.category_id, 1, limit, "new");
      setArticles(resBody.data?.articles || []);
    } catch (err) {
      handleErrors(err as Error);
    } finally {
      setFetchCategoryArticlesLoad(false);
    }
  };

  useEffect(() => {
    fetchCategoryArticles();
  }, [category.category_id]);

  if (articles.length < 3) {
    return null;
  }

  return (
    <ArticlesGrid
      title={`${category?.title || ""}`}
      isLoading={fetchCategoryArticlesLoad}
      setIsLoading={setFetchCategoryArticlesLoad}
      articles={articles}
      displayFields={["title", "image", "views", "created_at", "creator_id"]}
    />
  );
};

export default CategoriesArticles;
