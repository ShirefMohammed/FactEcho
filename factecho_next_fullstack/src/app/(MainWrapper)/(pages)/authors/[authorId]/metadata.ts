import { IAuthor } from "@/types/entitiesTypes";
import { Metadata } from "next";

export function generateAuthorMetadata(author: IAuthor | null): Metadata {
  return {
    title: author ? `${author.name}` : "الكاتب",
    description: author
      ? `استكشف المقالات المكتوبة بواسطة ${author.name} على FactEcho.`
      : "استكشف المقالات المكتوبة بواسطة الكاتب على FactEcho.",
    keywords: ["مقالات الكاتب", "أخبار", "مواضيع", "محتوى مخصص", "FactEcho"],
    openGraph: {
      title: author ? `${author.name}` : "الكاتب",
      description: author
        ? `استكشف المقالات المكتوبة بواسطة ${author.name} على FactEcho.`
        : "استكشف المقالات المكتوبة بواسطة الكاتب على FactEcho.",
      type: "website",
      images: [
        {
          url: author?.avatar || "/Logo.svg",
          width: 1200,
          height: 630,
          alt: author ? `الكاتب: ${author.name}` : "الكاتب",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: author ? `${author.name}` : "الكاتب",
      description: author
        ? `استكشف المقالات المكتوبة بواسطة ${author.name} على FactEcho.`
        : "استكشف المقالات المكتوبة بواسطة الكاتب على FactEcho.",
    },
  };
}
