"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { IArticle } from "@shared/types/entitiesTypes";

import { useArticlesAPIs } from "../../../../../../api/client/useArticlesAPIs";
import { CategoriesList, LatestArticlesList } from "../../../../../../components";
import { useHandleErrors } from "../../../../../../hooks";
import ArticleViewer from "./ArticleViewer";
import RelatedArticlesByCategory from "./RelatedArticlesByCategory";
import TrendArticlesSection from "./TrendArticlesSection";

const Article = () => {
  const { articleId } = useParams<{ articleId: string }>();

  const [article, setArticle] = useState<IArticle | null>(null);
  const [fetchArticleLoad, setFetchArticleLoad] = useState<boolean>(false);

  const handleErrors = useHandleErrors();
  const articlesAPIs = useArticlesAPIs();

  /**
   * Fetches the article data by its ID from the API.
   * Updates the `article` state on successful fetch or handles errors on failure.
   */
  const fetchArticle = async (): Promise<void> => {
    try {
      setFetchArticleLoad(true);
      const resBody = await articlesAPIs.getArticleById(articleId!);
      setArticle(resBody.data?.article || null);
    } catch (err: any) {
      handleErrors(err);
    } finally {
      setFetchArticleLoad(false);
    }
  };

  // Fetch the article whenever `articleId` changes.
  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  return (
    <section className="flex gap-4">
      {/* Right Side */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Component to display the article content */}
        <ArticleViewer article={article} fetchArticleLoad={fetchArticleLoad} />
        {/* Component to display articles related to the current article's category */}
        {<RelatedArticlesByCategory article={article!} />}
        {/* Section to display trending articles */}
        <TrendArticlesSection />
      </div>

      {/* Left Side */}
      <div className="hidden lg:flex w-80 flex-col gap-5">
        {/* Component to display the list of article categories */}
        <CategoriesList />
        {/* Component to display the latest articles */}
        <LatestArticlesList />
      </div>
    </section>
  );
};

export default Article;
