import Link from "next/link";

import { ApiBodyResponse, GetArticlesResponse } from "@shared/types/apiTypes";
import { IArticle } from "@shared/types/entitiesTypes";

import { articlesAPIs } from "../api/server/articlesAPIs";

const LatestArticlesList = async () => {
  const limit = 5;

  // Fetch latest articles on the server
  let articles: IArticle[] = [];
  try {
    const resBody: ApiBodyResponse<GetArticlesResponse> =
      await articlesAPIs.getLatestArticles(limit);
    articles = resBody.data?.articles || [];
  } catch (error) {
    console.error("Error fetching latest articles:", error);
  }

  return (
    <div className="w-full p-5 rounded-lg border border-slate-200">
      {/* Header */}
      <h3 className="pb-3 mb-4 border-b border-slate-200 font-bold text-lg">المقالات الجديدة</h3>

      {/* Render the articles list */}
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
    </div>
  );
};

export default LatestArticlesList;
