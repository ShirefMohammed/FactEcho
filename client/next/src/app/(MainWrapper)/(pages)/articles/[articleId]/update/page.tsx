"use client";

import dynamic from "next/dynamic";

const UpdateArticle = dynamic(() => import("./_components/UpdateArticle"), { ssr: false });

export default UpdateArticle;
