import { Metadata } from "next";

export const exploreMetadata: Metadata = {
  title: "استكشف المقالات",
  description: "تصفح المقالات المقترحة واكتشف محتوى جديد مثير للاهتمام",
  keywords: ["articles", "explore", "content", "factecho", "مقالات", "استكشاف"],
  openGraph: {
    title: "استكشف المقالات | FactEcho",
    description: "تصفح المقالات المقترحة واكتشف محتوى جديد مثير للاهتمام",
    type: "website",
    images: [
      {
        url: "/Logo.svg",
        width: 1200,
        height: 630,
        alt: "FactEcho Explore Articles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "استكشف المقالات | FactEcho",
    description: "تصفح المقالات المقترحة واكتشف محتوى جديد مثير للاهتمام",
  },
};
