"use client";

import { articlesAPIs } from "@/axios/apis/articlesAPIs";
import { ArticlesGrid } from "@/components";
import { useHandleErrors } from "@/hooks";
import { ApiBodyResponse, GetArticlesResponse, NextAuthUserSession } from "@/types/apiTypes";
import { IArticle } from "@/types/entitiesTypes";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ReadingListPage() {
  const limit = 15;

  const { data: session } = useSession();
  const currentUser = session?.user as NextAuthUserSession;

  const [articles, setArticles] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [articlesPage, setArticlesPage] = useState<number>(1);

  const handleErrors = useHandleErrors();

  const fetchReadingList = async () => {
    try {
      setIsLoading(true);
      const resBody: ApiBodyResponse<GetArticlesResponse> = await articlesAPIs.getSavedArticles(
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

  useEffect(() => {
    setArticles([]);
    fetchReadingList();
  }, [currentUser?.user_id]);

  useEffect(() => {
    if (articlesPage > 1) fetchReadingList();
  }, [articlesPage]);

  return (
    <ArticlesGrid
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      articles={articles}
      displayFields={["title", "image", "views", "created_at", "creator_id"]}
      gridClassName="grid gap-4 md:grid-cols-2"
      btn={{
        articlesLength: articles.length,
        limit: limit,
        page: articlesPage,
        setPage: setArticlesPage,
      }}
    />
  );
}
