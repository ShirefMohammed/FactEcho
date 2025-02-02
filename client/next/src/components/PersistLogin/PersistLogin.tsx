"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Logo from "../../assets/Logo.svg";
import { useRefreshToken } from "../../hooks";
import { StoreState } from "../../store/store";
import style from "./PersistLogin.module.css";

const PersistLogin = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [persist] = useState<boolean>(localStorage.getItem("persist") === "true");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const accessToken = useSelector((state: StoreState) => state.accessToken);
  const refresh = useRefreshToken();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        // If persistence is enabled and there is no access token, refresh the token
        if (persist && !accessToken) await refresh();
      } catch (err) {
        console.error("Error refreshing token: ", err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyRefreshToken();
  }, []);

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
              <Link href="https://shiref-mohammed.onrender.com/">Shiref Mohammed</Link>
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
