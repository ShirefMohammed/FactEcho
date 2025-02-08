"use client";

import dynamic from "next/dynamic";

const ReadingList = dynamic(() => import("../_components/ReadingList"), {
  ssr: false,
});

export default ReadingList;
