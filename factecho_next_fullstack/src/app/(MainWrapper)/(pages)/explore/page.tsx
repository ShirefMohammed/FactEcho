import { articlesAPIs } from "@/axios/apis/articlesAPIs";
import { ArticlesGrid } from "@/components";
import { IArticle } from "@/types/entitiesTypes";
import { Metadata } from "next";

import { exploreMetadata } from "./metadata";

export const revalidate = 60;

export const metadata: Metadata = exploreMetadata;

export default async function ExplorePage() {
  const limit = 15;
  let articles: IArticle[] = [];

  try {
    const response = await articlesAPIs.getExploredArticles(limit);
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
