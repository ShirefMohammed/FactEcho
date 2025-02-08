"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiBodyResponse, GetArticlesResponse } from "@shared/types/apiTypes";
import { IArticle } from "@shared/types/entitiesTypes";

import { useArticlesAPIs } from "../api/client/useArticlesAPIs";
import { useHandleErrors } from "../hooks";

const LatestArticlesList = () => {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleErrors = useHandleErrors();
  const articlesAPIs = useArticlesAPIs();

  /**
   * Fetches latest articles from the API with a specific page, limit, and sort order.
   * Updates the state with the fetched articles or handles errors on failure.
   */
  const fetchLatestArticles = async () => {
    try {
      setIsLoading(true);
      const resBody: ApiBodyResponse<GetArticlesResponse> = await articlesAPIs.getLatestArticles(5);
      setArticles(resBody.data?.articles || []);
    } catch (err) {
      handleErrors(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestArticles();
  }, []);

  return (
    <div className="w-full p-5 rounded-lg border border-slate-200">
      {/* Header */}
      <h3 className="pb-3 mb-4 border-b border-slate-200 font-bold text-lg">المقالات الجديدة</h3>

      {/* Conditionally render the articles list or a loading indicator */}
      {!isLoading ? (
        <ul className="flex flex-col gap-3 list-disc pr-6">
          {articles.map((article) => (
            <li key={article.article_id}>
              <Link
                href={`/articles/${article.article_id}`}
                className="flex items-center gap-3 hover:underline hover:text-primaryColor"
              >
                <span className="text-sm">{article.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500">جاري التحميل...</div>
      )}
    </div>
  );
};

export default LatestArticlesList;
