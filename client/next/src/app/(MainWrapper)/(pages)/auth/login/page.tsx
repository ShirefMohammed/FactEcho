"use client";

import dynamic from "next/dynamic";

const Login = dynamic(() => import("../_components/Login/Login"), {
  ssr: false,
});

export default Login;
