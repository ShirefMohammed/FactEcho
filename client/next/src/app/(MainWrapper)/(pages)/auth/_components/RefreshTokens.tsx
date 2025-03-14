"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useLogout, useRefreshToken } from "../../../../../hooks";

const RefreshTokens = () => {
  const refresh = useRefreshToken();
  const logout = useLogout();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/"; // Default to home if no route is stored

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
        router.push(from); // Redirect to the stored route
      } catch (err) {
        logout();
      }
    };

    verifyRefreshToken();
  }, []);

  return <section>Refresh tokens...</section>;
};

export default RefreshTokens;
