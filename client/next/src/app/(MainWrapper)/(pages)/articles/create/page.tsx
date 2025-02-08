"use client";

import dynamic from "next/dynamic";

const CreateArticle = dynamic(() => import("./_components/CreateArticle"), { ssr: false });

export default CreateArticle;
