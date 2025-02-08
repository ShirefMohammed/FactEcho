"use client";

import dynamic from "next/dynamic";

const Article = dynamic(() => import("./_components/Article"), { ssr: false });

export default Article;
