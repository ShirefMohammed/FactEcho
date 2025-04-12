"use client";

import facebookIcon from "@/assets/facebookIcon.svg";
import { signIn } from "next-auth/react";
import Image from "next/image";

export const LoginWithFacebookButton = () => {
  const loginWithFacebook = async () => {
    signIn("facebook", { redirect: true, callbackUrl: "/" });
  };

  return (
    <button type="button" onClick={loginWithFacebook}>
      <Image src={facebookIcon} alt="facebook icon" />
      <span>الاستمرار عبر فيسبوك</span>
    </button>
  );
};
