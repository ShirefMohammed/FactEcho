"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { JSX } from "react";
import { useSelector } from "react-redux";

import { StoreState } from "../store/store";

const RequireAuth = ({
  allowedRoles,
  children,
}: {
  allowedRoles: number[];
  children: React.ReactNode;
}): JSX.Element | null => {
  const currentUser = useSelector((state: StoreState) => state.currentUser);
  const accessToken = useSelector((state: StoreState) => state.accessToken);
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Short delay to allow PersistLogin to complete its token refresh
    // This ensures we don't redirect prematurely
    const timeoutId = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  // Don't do anything while we're checking auth status
  if (isCheckingAuth) {
    return null;
  }

  if (!currentUser || !accessToken) {
    // Redirect to login if not authenticated
    router.replace("/auth");
    return null;
  }

  if (currentUser?.role && allowedRoles.indexOf(currentUser.role) === -1) {
    // Redirect to unauthorized if role is not allowed
    router.replace("/unauthorized");
    return null;
  }

  return <>{children}</>;
};

export default RequireAuth;
