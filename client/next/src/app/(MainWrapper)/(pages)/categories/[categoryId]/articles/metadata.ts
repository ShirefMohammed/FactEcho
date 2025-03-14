import { Metadata } from "next";

import { ICategory } from "@shared/types/entitiesTypes";

export function generateCategoryMetadata(category: ICategory | null): Metadata {
  return {
    title: category ? `${category.title} | FactEcho` : "التصنيفات | FactEcho",
    description: category
      ? `استكشف المقالات في تصنيف "${category.title}" على FactEcho.`
      : "استكشف المقالات حسب التصنيفات في FactEcho، حيث تجد الأخبار والمحتوى الذي يناسب اهتماماتك.",
    keywords: ["تصنيفات المقالات", "أخبار", "مواضيع", "محتوى مخصص", "FactEcho"],
    openGraph: {
      title: category ? `${category.title} | FactEcho` : "التصنيفات | FactEcho",
      description: category
        ? `استكشف المقالات في تصنيف "${category.title}" على FactEcho.`
        : "استكشف المقالات حسب التصنيفات في FactEcho، حيث تجد الأخبار والمحتوى الذي يناسب اهتماماتك.",
      type: "website",
      images: [
        {
          url: "/Logo.svg", // Use the correct path for the OG image
          width: 1200,
          height: 630,
          alt: category ? `تصنيف: ${category.title}` : "التصنيفات | FactEcho",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: category ? `${category.title} | FactEcho` : "التصنيفات | FactEcho",
      description: category
        ? `استكشف المقالات في تصنيف "${category.title}" على FactEcho.`
        : "استكشف المقالات حسب التصنيفات في FactEcho، حيث تجد الأخبار والمحتوى الذي يناسب اهتماماتك.",
    },
  };
}
