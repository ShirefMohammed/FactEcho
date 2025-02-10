import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ApiBodyResponse, GetArticlesResponse } from "@shared/types/apiTypes";
import { IArticle } from "@shared/types/entitiesTypes";

import { useArticlesAPIs } from "../api/hooks/useArticlesAPIs";
import { useHandleErrors } from "../hooks";

const LatestArticlesList = memo(() => {
  const limit = 5;

  // State to store the fetched articles
  const [articles, setArticles] = useState<IArticle[]>([]);
  // State to track the loading status of the API call
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Custom hook to handle API errors
  const handleErrors = useHandleErrors();
  // API methods for articles
  const articlesAPIs = useArticlesAPIs();

  /**
   * Fetches latest articles from the API with a specific page, limit, and sort order.
   * Updates the state with the fetched articles or handles errors on failure.
   */
  const fetchLatestArticles = async () => {
    try {
      setIsLoading(true); // Indicate loading state
      const resBody: ApiBodyResponse<GetArticlesResponse> =
        await articlesAPIs.getLatestArticles(limit);
      setArticles(resBody.data?.articles || []); // Safely set the articles
    } catch (err) {
      handleErrors(err); // Handle any errors using the custom hook
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Trigger the fetchLatestArticles function once when the component mounts
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
                to={`/articles/${article.article_id}`}
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
});

export default LatestArticlesList;
