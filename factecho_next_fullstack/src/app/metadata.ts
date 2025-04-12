import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_CLIENT_URL || "https://factecho.com";

export const rootMetadata: Metadata = {
  title: {
    default: "FactEcho - World News",
    template: "%s | FactEcho",
  },
  description: "Your source for the latest news, articles, and trends on FactEcho.",
  authors: [{ name: "Shiref Mohammed" }],
  keywords: "news, articles, trends, FactEcho, latest, explore",
  robots: "index, follow",
  openGraph: {
    title: "FactEcho - Stay Informed with Latest News & Trends",
    description: "FactEcho delivers breaking news, in-depth articles, and trending stories from around the world.",
    url: SITE_URL,
    siteName: "FactEcho",
    type: "website",
  },
  alternates: {
    canonical: SITE_URL,
  },
};


export default rootMetadata;
