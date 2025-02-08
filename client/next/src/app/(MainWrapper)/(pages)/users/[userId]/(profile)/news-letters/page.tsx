"use client";

import dynamic from "next/dynamic";

const Newsletters = dynamic(() => import("../_components/Newsletters"), {
  ssr: false,
});

export default Newsletters;
