import { Metadata } from "next";

export const updateArticleMetadata: Metadata = {
  title: "تحديث مقال | FactEcho",
  description: "قم بتحديث مقال موجود على FactEcho.",
  keywords: ["تحديث مقال", "FactEcho", "مقالات", "أخبار"],
  openGraph: {
    title: "تحديث مقال | FactEcho",
    description: "قم بتحديث مقال موجود على FactEcho.",
    type: "website",
    images: [
      {
        url: "/Logo.svg",
        width: 1200,
        height: 630,
        alt: "FactEcho Update Article Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "تحديث مقال | FactEcho",
    description: "قم بتحديث مقال موجود على FactEcho.",
  },
};
