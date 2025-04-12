import { Metadata } from "next";

export const metadata: Metadata = {
  title: "أحدث المقالات",
  description:
    "استمتع بقراءة أحدث المقالات على FactEcho، حيث المحتوى الجديد والمفيد في متناول يدك.",
  keywords: ["أحدث المقالات", "أخبار", "مقالات جديدة", "محتوى متنوع", "FactEcho"],
  openGraph: {
    title: "أحدث المقالات | FactEcho",
    description: "تابع أحدث المقالات على FactEcho، حيث تجد المحتوى الجديد والمثير للاهتمام.",
    type: "website",
    images: [
      {
        url: "/Logo.svg",
        width: 1200,
        height: 630,
        alt: "FactEcho Latest Articles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "أحدث المقالات | FactEcho",
    description: "تابع أحدث المقالات على FactEcho، حيث تجد المحتوى الجديد والمثير للاهتمام.",
  },
};
