import { Metadata } from "next";

const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "https://factecho.com";

export const metadata: Metadata = {
  title: "استكشف المقالات | FactEcho",
  description:
    "استمتع بقراءة أحدث المقالات المقترحة على FactEcho، حيث المحتوى الغني والمفيد بين يديك.",
  keywords: "مقالات, أخبار, مقالات مقترحة, محتوى متنوع, FactEcho",
  alternates: {
    canonical: `${CLIENT_URL}/explore`,
  },
  openGraph: {
    title: "استكشف المقالات | FactEcho",
    description: "اكتشف أحدث المقالات المقترحة لك في FactEcho، واستمتع بمحتوى متنوع وغني.",
    url: `${CLIENT_URL}/explore`,
    siteName: "FactEcho",
    type: "website",
  },
};
