import { articlesAPIs } from "@/axios/apis/articlesAPIs";
import { ArticlesGrid } from "@/components";
import { IArticle } from "@/types/entitiesTypes";
import { Metadata } from "next";

import { metadata as latestMetadata } from "./metadata";

export const revalidate = 60;

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
