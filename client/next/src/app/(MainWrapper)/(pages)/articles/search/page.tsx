"use client";

import dynamic from "next/dynamic";

const SearchArticles = dynamic(() => import("./_components/SearchArticles"), { ssr: false });

export default SearchArticles;
