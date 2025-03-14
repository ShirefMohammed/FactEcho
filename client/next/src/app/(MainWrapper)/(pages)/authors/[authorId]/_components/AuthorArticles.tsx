"use client";

import { useEffect, useState } from "react";

import { ApiBodyResponse, GetArticlesResponse } from "@shared/types/apiTypes";
import { IArticle, IAuthor } from "@shared/types/entitiesTypes";

import { useAuthorsAPIs } from "../../../../../../api/client/useAuthorsAPIs";
import { ArticlesGrid } from "../../../../../../components";
import { useHandleErrors } from "../../../../../../hooks";

interface AuthorArticlesProps {
  author: IAuthor | null;
}

const AuthorArticles = ({ author }: AuthorArticlesProps) => {
  const limit = 15;
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [articlesPage, setArticlesPage] = useState<number>(1);

  const handleErrors = useHandleErrors();
  const authorsAPIs = useAuthorsAPIs();

  // Fetch author articles whenever the articlesPage changes
  useEffect(() => {
    const fetchAuthorArticles = async () => {
      if (!author?.user_id) return;

      try {
        setIsLoading(true);
        const resBody: ApiBodyResponse<GetArticlesResponse> = await authorsAPIs.getAuthorArticles(
          author.user_id,
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

    fetchAuthorArticles();
  }, [articlesPage, author?.user_id]);

  return (
    <ArticlesGrid
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

export default AuthorArticles;
