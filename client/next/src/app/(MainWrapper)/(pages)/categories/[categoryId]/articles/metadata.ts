import { Metadata } from "next";

export const metadata: Metadata = {
  title: "التصنيفات | FactEcho",
  description:
    "استكشف المقالات حسب التصنيفات في FactEcho، حيث تجد الأخبار والمحتوى الذي يناسب اهتماماتك.",
  keywords: ["تصنيفات المقالات", "أخبار", "مواضيع", "محتوى مخصص", "FactEcho"],
  openGraph: {
    title: "التصنيفات | FactEcho",
    description: "تصفح المقالات حسب التصنيفات المختلفة في FactEcho، واكتشف المحتوى الذي يهمك.",
    type: "website",
    images: [
      {
        url: "/Logo.svg", // تأكد من استخدام المسار الصحيح لصورة OG
        width: 1200,
        height: 630,
        alt: "FactEcho Categories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "التصنيفات | FactEcho",
    description: "تصفح المقالات حسب التصنيفات المختلفة في FactEcho، واكتشف المحتوى الذي يهمك.",
  },
};
