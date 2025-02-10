import { Metadata } from "next";

const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "https://factecho.com";

export const metadata: Metadata = {
  title: "أحدث المقالات | FactEcho",
  description:
    "استمتع بقراءة أحدث المقالات على FactEcho، حيث المحتوى الجديد والمفيد في متناول يدك.",
  keywords: "أحدث المقالات, أخبار, مقالات جديدة, محتوى متنوع, FactEcho",
  alternates: {
    canonical: `${CLIENT_URL}/latest`,
  },
  openGraph: {
    title: "أحدث المقالات | FactEcho",
    description: "تابع أحدث المقالات على FactEcho، حيث تجد المحتوى الجديد والمثير للاهتمام.",
    url: `${CLIENT_URL}/latest`,
    siteName: "FactEcho",
    type: "website",
  },
};
