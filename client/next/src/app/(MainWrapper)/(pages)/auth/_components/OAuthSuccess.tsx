"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useNotify, useRefreshToken } from "../../../../../hooks";

const OAuthSuccess = () => {
  const refresh = useRefreshToken();
  const router = useRouter();
  const notify = useNotify();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
        notify("success", "تم تسجيل الدخول بنجاح");
        router.push("/");
      } catch (err) {
        notify("error", "فشل تسجيل الدخول. يرجى المحاولة لاحقًا.");
        router.push("/auth");
      }
    };

    verifyRefreshToken();
  }, [router]);

  return <section>جاري معالجة تسجيل الدخول...</section>;
};

export default OAuthSuccess;
