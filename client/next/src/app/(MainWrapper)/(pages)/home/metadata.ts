import { Metadata } from "next";

export const homeMetadata: Metadata = {
  title: "الصفحة الرئيسية | FactEcho",
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
    title: "الصفحة الرئيسية | FactEcho",
    description: "اكتشف أحدث المقالات والأقسام والمواضيع الأكثر شيوعًا على FactEcho",
    type: "website",
    url: "https://factecho.com", // Replace with your actual domain
    images: [
      {
        url: "/Logo.svg", // Add your actual OG image path
        width: 1200,
        height: 630,
        alt: "FactEcho Home Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "الصفحة الرئيسية | FactEcho",
    description: "اكتشف أحدث المقالات والأقسام والمواضيع الأكثر شيوعًا على FactEcho",
    images: [
      {
        url: "/Logo.svg", // Add your actual Twitter image path
        width: 1200,
        height: 630,
        alt: "FactEcho Home Page",
      },
    ],
  },
};
