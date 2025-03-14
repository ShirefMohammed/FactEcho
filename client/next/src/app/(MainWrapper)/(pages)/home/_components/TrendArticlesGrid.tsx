import { ApiBodyResponse, GetArticlesResponse } from "@shared/types/apiTypes";
import { IArticle } from "@shared/types/entitiesTypes";

import { articlesAPIs } from "../../../../../api/server/articlesAPIs";
import ArticlesGrid from "../../../../../components/ArticlesGrid";

const TrendArticlesGrid = async () => {
  const limit = 4;

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
    <ArticlesGrid
      isLoading={false}
      articles={trendArticles}
      displayFields={["title", "image", "views", "created_at", "creator_id"]}
      gridClassName="grid gap-4 md:grid-cols-2"
    />
  );
};

export default TrendArticlesGrid;
