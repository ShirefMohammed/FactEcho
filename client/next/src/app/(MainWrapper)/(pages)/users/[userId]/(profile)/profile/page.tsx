"use client";

import dynamic from "next/dynamic";

const PersonalInfo = dynamic(() => import("../_components/PersonalInfo"), {
  ssr: false,
});

export default PersonalInfo;
