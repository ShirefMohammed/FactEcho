"use client";

import dynamic from "next/dynamic";

const AuthLayout = dynamic(() => import("./_components/AuthLayout"), {
  ssr: false,
});

export default AuthLayout;
