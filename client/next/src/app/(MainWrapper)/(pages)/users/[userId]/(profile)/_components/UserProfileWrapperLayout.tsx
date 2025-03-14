"use client";

import {
  IconDefinition,
  faBookmark,
  faEnvelope,
  faGear,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

import { RequireAuth } from "../../../../../../../components";
import { StoreState } from "../../../../../../../store/store";
import { ROLES_LIST } from "../../../../../../../utils/constants";
import Sidebar from "./Sidebar";

export interface UserRouteType {
  label: string;
  path: string;
  icon: IconDefinition;
}

const UserProfileWrapperLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { userId } = useParams(); // Use useParams to get the userId from the dynamic route
  const pathname = usePathname(); // Use usePathname to get the current path
  const router = useRouter();
  const accessToken = useSelector((state: StoreState) => state.accessToken);
  const currentUser = useSelector((state: StoreState) => state.currentUser);

  // Define user-specific routes for navigation
  const userRoutes: UserRouteType[] = [
    { label: "حسابي", path: `/users/${userId}/profile`, icon: faUser },
    { label: "قائمة القراءة", path: `/users/${userId}/reading-list`, icon: faBookmark },
    { label: "النشرات البريدية", path: `/users/${userId}/news-letters`, icon: faEnvelope },
    { label: "إعدادات الحساب", path: `/users/${userId}/settings`, icon: faGear },
  ];

  // Identify the current active route based on the URL pathname
  const currentRoute = userRoutes.find((route) => route.path === pathname);

  // Redirect to the unauthorized page if the user is not authenticated or doesn't match the current user
  if (accessToken === "" || currentUser?.user_id !== userId) {
    router.push("/unauthorized");
  }

  if (pathname === `/users/${userId}`) {
    router.push(`/users/${userId}/profile`);
  }

  return (
    <section>
      {/* Display the header with the current route's label */}
      <h1 className="text-3xl font-bold mb-8 text-right">
        {currentRoute ? currentRoute.label : <Link href={`/users/${userId}`}>حسابي</Link>}
      </h1>

      {/* Layout for the sidebar and main content */}
      <section className="flex flex-col md:flex-row gap-4">
        {/* Sidebar navigation */}
        <section className="w-full md:w-55">
          <Sidebar userRoutes={userRoutes} />
        </section>

        {/* Main content based on the current route */}
        <section className="flex-1">{children}</section>
      </section>
    </section>
  );
};

const UserProfileWrapperLayoutAuth = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <RequireAuth allowedRoles={[ROLES_LIST.Admin, ROLES_LIST.Author, ROLES_LIST.User]}>
      <UserProfileWrapperLayout>{children}</UserProfileWrapperLayout>
    </RequireAuth>
  );
};

export default UserProfileWrapperLayoutAuth;
