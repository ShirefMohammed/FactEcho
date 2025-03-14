import { Metadata } from "next";

import { IArticle } from "@shared/types/entitiesTypes";

export function generateArticleMetadata(article: IArticle | null): Metadata {
  return {
    title: article ? `${article.title} | FactEcho` : "مقال | FactEcho",
    description: article ? `اقرأ المقال "${article.title}" على FactEcho.` : "مقال على FactEcho",
    keywords: ["مقال", "FactEcho", "مقالات", "أخبار"],
    openGraph: {
      title: article ? `${article.title} | FactEcho` : "مقال | FactEcho",
      description: article ? `اقرأ المقال "${article.title}" على FactEcho.` : "مقال على FactEcho",
      type: "website",
      images: [
        {
          url: article?.image || "/Logo.svg",
          width: 1200,
          height: 630,
          alt: article ? `مقال: ${article.title}` : "مقال على FactEcho",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article ? `${article.title} | FactEcho` : "مقال | FactEcho",
      description: article ? `اقرأ المقال "${article.title}" على FactEcho.` : "مقال على FactEcho",
    },
  };
}
