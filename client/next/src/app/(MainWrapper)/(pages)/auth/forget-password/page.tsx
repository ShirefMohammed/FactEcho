"use client";

import dynamic from "next/dynamic";

const ForgetPassword = dynamic(() => import("../_components/ForgetPassword/ForgetPassword"), {
  ssr: false,
});

export default ForgetPassword;
