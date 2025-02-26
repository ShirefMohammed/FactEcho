import { Metadata } from "next";

import { IArticle } from "@shared/types/entitiesTypes";

import { ArticlesAPI } from "../../../../api/server/articlesAPIs";
import { ArticlesGrid } from "../../../../components";
import { metadata as trendMetadata } from "./metadata";

// Revalidate the page every 300 seconds (5 minutes) ISR
export const revalidate = 300;

// Export the imported metadata for SEO
export const metadata: Metadata = trendMetadata;

export default async function TrendPage() {
  const limit = 15;
  let articles: IArticle[] = [];

  try {
    const response = await ArticlesAPI.getTrendArticles(limit);
    articles = response.data?.articles || [];
  } catch (error) {
    console.error("Error fetching trend articles:", error);
  }

  return (
    <ArticlesGrid
      title="المقالات الرائجة"
      isLoading={false}
      articles={articles}
      displayFields={["title", "image", "views", "created_at", "creator_id"]}
    />
  );
}
