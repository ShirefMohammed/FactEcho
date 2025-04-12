import { Metadata } from "next";

export const createArticleMetadata: Metadata = {
  title: "إنشاء مقال | FactEcho",
  description: "أنشئ مقالًا جديدًا على FactEcho.",
  keywords: ["إنشاء مقال", "FactEcho", "مقالات", "أخبار"],
  openGraph: {
    title: "إنشاء مقال | FactEcho",
    description: "أنشئ مقالًا جديدًا على FactEcho.",
    type: "website",
    images: [
      {
        url: "/Logo.svg",
        width: 1200,
        height: 630,
        alt: "FactEcho Create Article Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "إنشاء مقال | FactEcho",
    description: "أنشئ مقالًا جديدًا على FactEcho.",
  },
};
