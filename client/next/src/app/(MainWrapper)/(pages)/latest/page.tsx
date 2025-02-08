"use client";

import dynamic from "next/dynamic";

const LatestArticles = dynamic(() => import("./_components/LatestArticles"), {
  ssr: false,
});

export default LatestArticles;
