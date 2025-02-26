import { Metadata } from "next";

import { IArticle } from "@shared/types/entitiesTypes";

import { ArticlesAPI } from "../../../../api/server/articlesAPIs";
import { ArticlesGrid } from "../../../../components";
import { exploreMetadata } from "./metadata";

// Revalidate the page every 300 seconds (5 minutes) ISR
export const revalidate = 300;

// Export the imported metadata for SEO
export const metadata: Metadata = exploreMetadata;

export default async function ExplorePage() {
  const limit = 15;
  let articles: IArticle[] = [];

  try {
    const response = await ArticlesAPI.getExploredArticles(limit);
    articles = response.data?.articles || [];
  } catch (error) {
    console.error("Error fetching explored articles:", error);
  }

  return (
    <ArticlesGrid
      title="المقالات المقترحة"
      isLoading={false}
      articles={articles}
      displayFields={["title", "image", "views", "created_at", "creator_id"]}
    />
  );
}
