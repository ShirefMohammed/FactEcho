import { ICategory } from "@/types/entitiesTypes";
import { Metadata } from "next";

export function generateCategoryMetadata(category: ICategory | null): Metadata {
  return {
    title: category ? `${category.title}` : "التصنيفات",
    description: category
      ? `استكشف المقالات في تصنيف "${category.title}" على FactEcho.`
      : "استكشف المقالات حسب التصنيفات في FactEcho، حيث تجد الأخبار والمحتوى الذي يناسب اهتماماتك.",
    keywords: ["تصنيفات المقالات", "أخبار", "مواضيع", "محتوى مخصص", "FactEcho"],
    openGraph: {
      title: category ? `${category.title}` : "التصنيفات",
      description: category
        ? `استكشف المقالات في تصنيف "${category.title}" على FactEcho.`
        : "استكشف المقالات حسب التصنيفات في FactEcho، حيث تجد الأخبار والمحتوى الذي يناسب اهتماماتك.",
      type: "website",
      images: [
        {
          url: "/Logo.svg", // Use the correct path for the OG image
          width: 1200,
          height: 630,
          alt: category ? `تصنيف: ${category.title}` : "التصنيفات",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: category ? `${category.title}` : "التصنيفات",
      description: category
        ? `استكشف المقالات في تصنيف "${category.title}" على FactEcho.`
        : "استكشف المقالات حسب التصنيفات في FactEcho، حيث تجد الأخبار والمحتوى الذي يناسب اهتماماتك.",
    },
  };
}
