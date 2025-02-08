"use client";

import dynamic from "next/dynamic";

const Forbidden = dynamic(() => import("./_components/Forbidden"), { ssr: false });

export default Forbidden;
