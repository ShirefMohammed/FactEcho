"use client";

import dynamic from "next/dynamic";

const TrendArticles = dynamic(() => import("./_components/TrendArticles"), {
  ssr: false,
});

export default TrendArticles;
