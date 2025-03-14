"use client";

import dynamic from "next/dynamic";

const RefreshTokens = dynamic(() => import("../_components/RefreshTokens"), { ssr: false });

export default RefreshTokens;
