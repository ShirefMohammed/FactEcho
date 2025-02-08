"use client";

import dynamic from "next/dynamic";

const NoResourceFound = dynamic(() => import("./_components/NoResourceFound"), { ssr: false });

export default NoResourceFound;
