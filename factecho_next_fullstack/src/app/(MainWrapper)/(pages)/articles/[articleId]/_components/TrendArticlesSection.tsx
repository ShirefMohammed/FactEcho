import { articlesAPIs } from "@/axios/apis/articlesAPIs";
import { ArticlesGrid } from "@/components";
import { ApiBodyResponse, GetArticlesResponse } from "@/types/apiTypes";
import { IArticle } from "@/types/entitiesTypes";

export default async function TrendArticlesSection() {
  const limit = 4;

  // Fetch trending articles on the server
  let articles: IArticle[] = [];
  try {
    const resBody: ApiBodyResponse<GetArticlesResponse> =
      await articlesAPIs.getTrendArticles(limit);
    articles = resBody.data?.articles || [];
  } catch (error) {
    console.error("Error fetching trending articles:", error);
  }

  return (
    <ArticlesGrid
      title="المقالات الرائجة"
      isLoading={false}
      articles={articles}
      displayFields={["title", "image", "views", "created_at", "creator_id"]}
      gridClassName="grid gap-4 md:grid-cols-2"
    />
  );
}
