"use client";

import dynamic from "next/dynamic";

const Unauthorized = dynamic(() => import("./_components/Unauthorized"), { ssr: false });

export default Unauthorized;
