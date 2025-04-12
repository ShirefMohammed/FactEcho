import { Metadata } from "next";

export const searchMetadata: Metadata = {
  title: "بحث المقالات",
  description: "ابحث عن أحدث المقالات والأخبار على FactEcho.",
  keywords: ["بحث المقالات", "FactEcho", "مقالات", "أخبار"],
  openGraph: {
    title: "بحث المقالات",
    description: "ابحث عن أحدث المقالات والأخبار على FactEcho.",
    type: "website",
    images: [
      {
        url: "/Logo.svg",
        width: 1200,
        height: 630,
        alt: "FactEcho Search Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "بحث المقالات",
    description: "ابحث عن أحدث المقالات والأخبار على FactEcho.",
  },
};
