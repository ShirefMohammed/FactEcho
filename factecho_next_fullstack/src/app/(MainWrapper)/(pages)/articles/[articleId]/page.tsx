import { articlesAPIs } from "@/axios/apis/articlesAPIs";
import { CategoriesList, LatestArticlesList } from "@/components";
import { ApiBodyResponse, GetArticleResponse } from "@/types/apiTypes";
import { Metadata } from "next";

import ArticleViewer from "./_components/ArticleViewer";
import RelatedArticlesByCategory from "./_components/RelatedArticlesByCategory";
import TrendArticlesSection from "./_components/TrendArticlesSection";
import { generateArticleMetadata } from "./metadata";

type ArticlePageProps = {
  params: Promise<{ articleId: string }>;
};

// ISR: Revalidate the page every 5 minutes
export const revalidate = 60;
export const dynamic = "force-static";

// Fetch article data for the page
async function getArticleData(articleId: string) {
  try {
    const resBody: ApiBodyResponse<GetArticleResponse> =
      await articlesAPIs.getArticleById(articleId);
    return resBody.data?.article || null;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

// Generate metadata dynamically
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { articleId } = await params;
  const article = await getArticleData(articleId);
  return generateArticleMetadata(article);
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { articleId } = await params;

  // console.log(`Regenerating ArticlePage [${articleId}] at:`, new Date().toISOString());

  const article = await getArticleData(articleId);

  return (
    <section className="flex gap-4">
      {/* Right Side */}
      <div className="flex-1 flex flex-col gap-8">
        <ArticleViewer article={article} fetchArticleLoad={false} />
        <RelatedArticlesByCategory article={article!} />
        <TrendArticlesSection />
      </div>

      {/* Left Side */}
      <div className="hidden lg:flex w-80 flex-col gap-5">
        <CategoriesList />
        <LatestArticlesList />
      </div>
    </section>
  );
}
