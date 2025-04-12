import { articlesAPIs } from "@/axios/apis/articlesAPIs";
import ArticlesGrid from "@/components/ArticlesGrid";
import { ApiBodyResponse, GetArticlesResponse } from "@/types/apiTypes";
import { IArticle } from "@/types/entitiesTypes";

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
