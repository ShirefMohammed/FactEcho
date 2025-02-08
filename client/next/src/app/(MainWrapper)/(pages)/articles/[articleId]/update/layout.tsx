"use client";

import dynamic from "next/dynamic";

const UpdateArticleLayout = dynamic(() => import("./_components/UpdateArticleLayout"), {
  ssr: false,
});

export default UpdateArticleLayout;
