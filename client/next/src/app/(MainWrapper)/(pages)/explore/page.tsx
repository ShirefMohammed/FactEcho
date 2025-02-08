"use client";

import dynamic from "next/dynamic";

const ExploreArticles = dynamic(() => import("./_components/ExploreArticles"), {
  ssr: false,
});

export default ExploreArticles;
