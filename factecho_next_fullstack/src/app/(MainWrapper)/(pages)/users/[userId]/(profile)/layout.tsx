"use client";

import { NextAuthUserSession } from "@/types/apiTypes";
import {
  IconDefinition,
  faBookmark,
  faEnvelope,
  faGear,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";

import Sidebar from "./_components/Sidebar";

export interface UserRouteType {
  label: string;
  path: string;
  icon: IconDefinition;
}

export default function UserProfileWrapperLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, status } = useSession();
  const currentUser = session?.user as NextAuthUserSession;

  // Define user-specific routes for navigation
  const userRoutes: UserRouteType[] = [
    { label: "حسابي", path: `/users/${userId}/profile`, icon: faUser },
    { label: "قائمة القراءة", path: `/users/${userId}/reading-list`, icon: faBookmark },
    { label: "النشرات البريدية", path: `/users/${userId}/news-letters`, icon: faEnvelope },
    { label: "إعدادات الحساب", path: `/users/${userId}/settings`, icon: faGear },
  ];

  // Identify the current active route based on the URL pathname
  const currentRoute = userRoutes.find((route) => route.path === pathname);

  if (status === "loading") {
    return <div className="animate-pulse h-96 bg-gray-200 rounded-lg">جارى التحميل...</div>;
  }

  if (status === "unauthenticated" || !session || currentUser?.user_id !== userId) {
    router.push("/unauthorized");
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-8 text-right">
        {currentRoute ? currentRoute.label : <Link href={`/users/${userId}`}>حسابي</Link>}
      </h1>

      <section className="flex flex-col md:flex-row gap-4">
        <section className="w-full md:w-55">
          <Sidebar userRoutes={userRoutes} />
        </section>

        <section className="flex-1">{children}</section>
      </section>
    </section>
  );
}
