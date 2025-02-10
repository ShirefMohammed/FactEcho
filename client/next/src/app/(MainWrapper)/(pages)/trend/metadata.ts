import { Metadata } from "next";

const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "https://factecho.com";

export const metadata: Metadata = {
  title: "المقالات الرائجة | FactEcho",
  description: "استكشف أكثر المقالات شهرة على FactEcho، حيث المحتوى الذي يهم الجميع.",
  keywords: "مقالات رائجة, أخبار, ترند, محتوى شائع, FactEcho",
  alternates: {
    canonical: `${CLIENT_URL}/trending`,
  },
  openGraph: {
    title: "المقالات الرائجة | FactEcho",
    description:
      "اكتشف المقالات الأكثر شهرة وتفاعلًا على FactEcho، حيث تجد المواضيع الأكثر تداولًا.",
    url: `${CLIENT_URL}/trending`,
    siteName: "FactEcho",
    type: "website",
  },
};
