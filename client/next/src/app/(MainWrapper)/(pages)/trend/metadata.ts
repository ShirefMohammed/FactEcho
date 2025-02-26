import { Metadata } from "next";

export const metadata: Metadata = {
  title: "المقالات الرائجة | FactEcho",
  description: "استكشف أكثر المقالات شهرة على FactEcho، حيث المحتوى الذي يهم الجميع.",
  keywords: ["مقالات رائجة", "أخبار", "ترند", "محتوى شائع", "FactEcho"],
  openGraph: {
    title: "المقالات الرائجة | FactEcho",
    description:
      "اكتشف المقالات الأكثر شهرة وتفاعلًا على FactEcho، حيث تججد المواضيع الأكثر تداولًا.",
    type: "website",
    images: [
      {
        url: "/Logo.svg", // Add your actual OG image path
        width: 1200,
        height: 630,
        alt: "FactEcho Trending Articles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "المقالات الرائجة | FactEcho",
    description:
      "اكتشف المقالات الأكثر شهرة وتفاعلًا على FactEcho، حيث تججد المواضيع الأكثر تداولًا.",
  },
};
