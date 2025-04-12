"use client";

import googleIcon from "@/assets/googleIcon.svg";
import { signIn } from "next-auth/react";
import Image from "next/image";

export const LoginWithGoogleButton = () => {
  const loginWithGoogle = async () => {
    signIn("google", { redirect: true, callbackUrl: "/" });
  };

  return (
    <button type="button" onClick={loginWithGoogle}>
      <Image src={googleIcon} alt="google icon" />
      <span>الاستمرار عبر غوغل</span>
    </button>
  );
};
