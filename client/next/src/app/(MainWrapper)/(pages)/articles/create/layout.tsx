"use client";

import dynamic from "next/dynamic";

const CreateArticleLayout = dynamic(() => import("./_components/CreateArticleLayout"), {
  ssr: false,
});

export default CreateArticleLayout;
