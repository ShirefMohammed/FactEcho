import Link from "next/link";

import { ApiBodyResponse, GetArticlesResponse } from "@shared/types/apiTypes";
import { IArticle } from "@shared/types/entitiesTypes";

import { articlesAPIs } from "../../../../../api/server/articlesAPIs";

const TrendArticlesList = async () => {
  const limit = 10;

  // Fetch trending articles on the server
  let trendArticles: IArticle[] = [];
  try {
    const resBody: ApiBodyResponse<GetArticlesResponse> =
      await articlesAPIs.getTrendArticles(limit);
    trendArticles = resBody.data?.articles || [];
  } catch (error) {
    console.error("Error fetching trend articles:", error);
  }

  return (
    <section className="w-full">
      <h2 className="pb-3 mb-6 border-b border-slate-200 font-bold text-2xl flex items-center gap-2">
        <span className="block w-3 h-3 bg-primaryColor rounded-full"></span>
        الأكثر قراءة
      </h2>

      <ul className="grid gap-6 md:grid-cols-2">
        {trendArticles.map((article, index) => (
          <li key={article.article_id} className="flex items-start">
            <span className="text-5xl ml-4 text-primaryColor">{index + 1}</span>
            <Link
              href={`/articles/${article.article_id}`}
              className="text-xl hover:underline font-bold"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TrendArticlesList;
