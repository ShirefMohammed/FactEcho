"use client";

import { useRouter } from "next/navigation";
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
  const isAuthReady = useSelector((state: StoreState) => state.authState.isAuthReady);
  const router = useRouter();

  // Only proceed with auth checks when PersistLogin has completed its work
  if (!isAuthReady) {
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
