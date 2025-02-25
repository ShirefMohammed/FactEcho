"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Logo from "../../assets/Logo.svg";
import { useRefreshToken } from "../../hooks";
import { setAuthReady } from "../../store/slices/authStateSlice";
import { StoreState } from "../../store/store";
import style from "./PersistLogin.module.css";

const PersistLogin = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [persist, setPersist] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const accessToken = useSelector((state: StoreState) => state.accessToken);
  const refresh = useRefreshToken();
  const dispatch = useDispatch();

  useEffect(() => {
    setPersist(localStorage.getItem("persist") === "true");
  }, []);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        // If persistence is enabled and there is no access token, refresh the token
        if (persist && !accessToken) await refresh();
      } catch (err) {
        console.error("Error refreshing token: ", err);
      } finally {
        setIsLoading(false);
        // Signal that auth checking is complete through Redux
        dispatch(setAuthReady(true));
      }
    };

    // If we already know persistence state
    if (persist !== null) {
      verifyRefreshToken();
    }
  }, [persist]);

  if (persist === null) {
    return null;
  }

  return (
    <>
      {
        // If persistence is not enabled, render the main content (`<>{children}</>`)
        !persist ? (
          <>{children}</>
        ) : // If refresh is still loading (fetching user data and access token)
        isLoading ? (
          <div className={style.loading_container}>
            <Image src={Logo} alt="FactEcho Logo" />
            <div className={style.creator}>
              <span>Created by</span>
              <Link href="https://shiref-mohammed.vercel.app/">Shiref Mohammed</Link>
            </div>
          </div>
        ) : (
          // If the refresh process is complete, render the main content (`<>{children}</>`)
          <>{children}</>
        )
      }
    </>
  );
};

export default PersistLogin;
