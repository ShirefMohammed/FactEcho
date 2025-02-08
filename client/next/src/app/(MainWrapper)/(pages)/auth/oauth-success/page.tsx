"use client";

import dynamic from "next/dynamic";

const OAuthSuccess = dynamic(() => import("../_components/OAuthSuccess"), { ssr: false });

export default OAuthSuccess;
