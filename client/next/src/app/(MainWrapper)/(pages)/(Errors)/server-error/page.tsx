"use client";

import dynamic from "next/dynamic";

const ServerError = dynamic(() => import("./_components/ServerError"), { ssr: false });

export default ServerError;
