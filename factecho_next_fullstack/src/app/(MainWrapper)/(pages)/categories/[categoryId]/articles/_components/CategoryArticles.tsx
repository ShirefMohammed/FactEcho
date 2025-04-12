"use client";

import { categoriesAPIs } from "@/axios/apis/categoriesAPIs";
import { ArticlesGrid } from "@/components";
import { useHandleErrors } from "@/hooks";
import { ApiBodyResponse, GetCategoryArticlesResponse } from "@/types/apiTypes";
import { IArticle, ICategory } from "@/types/entitiesTypes";
import { useEffect, useState } from "react";

interface CategoryArticlesProps {
  category: ICategory | null;
}

const CategoryArticles = ({ category }: CategoryArticlesProps) => {
  const limit = 15;
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [articlesPage, setArticlesPage] = useState<number>(1);

  const handleErrors = useHandleErrors();

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
