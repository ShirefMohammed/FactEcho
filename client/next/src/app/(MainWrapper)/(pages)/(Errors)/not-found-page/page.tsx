"use client";

import dynamic from "next/dynamic";

const NoTFoundPage = dynamic(() => import("./_components/NoTFoundPage"), { ssr: false });

export default NoTFoundPage;
