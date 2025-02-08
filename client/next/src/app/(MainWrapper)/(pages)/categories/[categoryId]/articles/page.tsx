"use client";

import dynamic from "next/dynamic";

const CategoryArticles = dynamic(() => import("./_components/CategoryArticles"), {
  ssr: false,
});

export default CategoryArticles;
