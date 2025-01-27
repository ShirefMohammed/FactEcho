import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ApiBodyResponse, GetArticlesResponse } from "@shared/types/apiTypes";
import { IArticle } from "@shared/types/entitiesTypes";

import { useArticlesAPIs } from "../../../api/hooks/useArticlesAPIs";
import { useHandleErrors } from "../../../hooks";

const TrendArticlesList = () => {
  const limit = 10; // Number of articles to fetch per page

  const [articles, setArticles] = useState<IArticle[]>([]); // Holds the list of articles fetched from the API
  const [isLoading, setIsLoading] = useState<boolean>(false); // Tracks the loading state of the API call

  const handleErrors = useHandleErrors(); // Hook to manage API error handling
  const articlesAPIs = useArticlesAPIs(); // Provides API methods related to articles

  /**
   * Fetches the trend articles from the API.
   * Limits the number of articles based on the defined limit.
   * Updates the articles state on success or handles errors if the call fails.
   */
  const fetchTrendArticles = async () => {
    try {
      setIsLoading(true); // Start loading
      const resBody: ApiBodyResponse<GetArticlesResponse> =
        await articlesAPIs.getTrendArticles(limit);
      setArticles(resBody.data?.articles || []); // Update state with fetched articles
    } catch (err) {
      handleErrors(err); // Handle errors with the custom hook
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Fetch articles when the component is mounted
  useEffect(() => {
    fetchTrendArticles();
  }, []);

  return (
    <section className="w-full">
      <h2 className="pb-3 mb-6 border-b border-slate-200 font-bold text-2xl flex items-center gap-2">
        <span className="block w-3 h-3 bg-primaryColor rounded-full"></span>
        الأكثر قراءة
      </h2>

      {!isLoading ? (
        <ul className="grid gap-6 md:grid-cols-2">
          {articles.map((article, index) => (
            <li key={article.article_id} className="flex items-start">
              <span className="text-5xl ml-4 text-primaryColor">{index + 1}</span>
              <Link
                to={`/articles/${article.article_id}`}
                className="text-xl hover:underline font-bold"
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500">جاري التحميل...</div>
      )}
    </section>
  );
};

export default TrendArticlesList;
