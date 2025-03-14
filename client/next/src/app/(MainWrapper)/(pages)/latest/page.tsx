import { Metadata } from "next";

import { IArticle } from "@shared/types/entitiesTypes";

import { articlesAPIs } from "../../../../api/server/articlesAPIs";
import { ArticlesGrid } from "../../../../components";
import { metadata as latestMetadata } from "./metadata";

// Revalidate the page every 300 seconds (5 minutes) ISR
export const revalidate = 300;

// Export the imported metadata for SEO
export const metadata: Metadata = latestMetadata;

export default async function LatestPage() {
  const limit = 15;
  let articles: IArticle[] = [];

  try {
    const response = await articlesAPIs.getLatestArticles(limit);
    articles = response.data?.articles || [];
  } catch (error) {
    console.error("Error fetching latest articles:", error);
  }

  return (
    <ArticlesGrid
      title="المقالات الجديدة"
      isLoading={false}
      articles={articles}
      displayFields={["title", "image", "views", "created_at", "creator_id"]}
    />
  );
}
