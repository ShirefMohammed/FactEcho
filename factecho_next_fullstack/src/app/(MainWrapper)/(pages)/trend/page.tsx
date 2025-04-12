import { articlesAPIs } from "@/axios/apis/articlesAPIs";
import { ArticlesGrid } from "@/components";
import { IArticle } from "@/types/entitiesTypes";
import { Metadata } from "next";

import { metadata as trendMetadata } from "./metadata";

export const revalidate = 60;

export const metadata: Metadata = trendMetadata;

export default async function TrendPage() {
  const limit = 15;
  let articles: IArticle[] = [];

  try {
    const response = await articlesAPIs.getTrendArticles(limit);
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
