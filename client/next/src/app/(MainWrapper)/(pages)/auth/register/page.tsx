"use client";

import dynamic from "next/dynamic";

const Register = dynamic(() => import("../_components/Register/Register"), { ssr: false });

export default Register;
