"use client";

import dynamic from "next/dynamic";

// import { metadata as exploreArticlesMetadata } from "./metadata";
// export const metadata: Metadata = exploreArticlesMetadata;

const ExploreArticles = dynamic(() => import("./_components/ExploreArticles"), {
  ssr: false,
});

export default ExploreArticles;
