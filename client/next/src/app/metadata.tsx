import { Metadata } from "next";

const metadata: Metadata = {
  title: {
    default: "FactEcho - News App",
    template: "%s | FactEcho",
  },
  description: "Your source for the latest news, articles, and trends on FactEcho.",
  authors: [{ name: "Shiref Mohammed" }],
  keywords: "news, articles, trends, FactEcho, latest, explore",
  robots: "index, follow", // You can adjust this based on your SEO strategy
};

export default metadata;
