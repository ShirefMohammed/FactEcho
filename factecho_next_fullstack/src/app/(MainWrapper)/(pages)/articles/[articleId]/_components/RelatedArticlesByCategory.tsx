import { categoriesAPIs } from "@/axios/apis/categoriesAPIs";
import { ArticlesGrid } from "@/components";
import { ApiBodyResponse, GetArticlesResponse } from "@/types/apiTypes";
import { IArticle } from "@/types/entitiesTypes";

interface RelatedArticlesByCategoryProps {
  article: IArticle;
}

export default async function RelatedArticlesByCategory({
  article,
}: RelatedArticlesByCategoryProps) {
  const limit = 4;

  // Fetch related articles on the server
  let relatedArticles: IArticle[] = [];
  try {
    const response: ApiBodyResponse<GetArticlesResponse> = await categoriesAPIs.getCategoryArticles(
      article.category_id!,
      1,
      limit,
      "new",
    );
    relatedArticles = response.data?.articles || [];
  } catch (error) {
    console.error("Error fetching related articles:", error);
  }

  return (
    <ArticlesGrid
      title="مقالات ذات صلة"
      isLoading={false}
      articles={relatedArticles}
      displayFields={["title", "image", "views", "created_at", "creator_id"]}
      gridClassName="grid gap-4 md:grid-cols-2"
    />
  );
}
