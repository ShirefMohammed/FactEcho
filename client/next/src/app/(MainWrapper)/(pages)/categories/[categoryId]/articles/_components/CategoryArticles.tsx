"use client";

import { useEffect, useState } from "react";

import { ApiBodyResponse, GetCategoryArticlesResponse } from "@shared/types/apiTypes";
import { IArticle, ICategory } from "@shared/types/entitiesTypes";

import { useCategoriesAPIs } from "../../../../../../../api/client/useCategoriesAPIs";
import { ArticlesGrid } from "../../../../../../../components";
import { useHandleErrors } from "../../../../../../../hooks";

interface CategoryArticlesProps {
  category: ICategory | null;
}

const CategoryArticles = ({ category }: CategoryArticlesProps) => {
  const limit = 15;
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [articlesPage, setArticlesPage] = useState<number>(1);

  const handleErrors = useHandleErrors();
  const categoriesAPIs = useCategoriesAPIs();

  // Fetch category articles whenever the articlesPage changes
  useEffect(() => {
    const fetchCategoryArticles = async () => {
      if (!category?.category_id) return;

      try {
        setIsLoading(true);
        const resBody: ApiBodyResponse<GetCategoryArticlesResponse> =
          await categoriesAPIs.getCategoryArticles(
            category.category_id,
            articlesPage,
            limit,
            "new",
          );
        setArticles((prevArticles) => [...prevArticles, ...(resBody.data?.articles || [])]);
      } catch (err) {
        handleErrors(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryArticles();
  }, [articlesPage, category?.category_id]);

  return (
    <ArticlesGrid
      title={`مقالات عن ${category?.title || ""}`}
      isLoading={isLoading}
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
