"use client";

import dynamic from "next/dynamic";

const NoServerResponse = dynamic(() => import("./_components/NoServerResponse"), { ssr: false });

export default NoServerResponse;
