import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "https://factecho.com";

export const homeMetadata: Metadata = {
  title: "FactEcho - الصفحة الرئيسية",
  description: "اكتشف أحدث المقالات والأقسام والمواضيع الأكثر شيوعًا على FactEcho",
  keywords: [
    "مقالات",
    "أخبار",
    "أقسام",
    "FactEcho",
    "الصفحة الرئيسية",
    "trending",
    "latest",
    "content",
  ],
  openGraph: {
    title: "FactEcho - Stay Informed with Latest News & Trends",
    description:
      "FactEcho delivers breaking news, in-depth articles, and trending stories from around the world.",
    url: SITE_URL,
    siteName: "FactEcho",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "الصفحة الرئيسية | FactEcho",
    description: "اكتشف أحدث المقالات والأقسام والمواضيع الأكثر شيوعًا على FactEcho",
    images: [
      {
        url: "/Logo.svg",
        width: 1200,
        height: 630,
        alt: "FactEcho Home Page",
      },
    ],
  },
};
