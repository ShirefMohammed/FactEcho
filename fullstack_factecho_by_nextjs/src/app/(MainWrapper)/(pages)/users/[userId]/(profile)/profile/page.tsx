"use client";

import googleIcon from "@/assets/googleIcon.svg";
import { NextAuthUserSession } from "@/types/apiTypes";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();
  const currentUser = session?.user as NextAuthUserSession;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Email section */}
      <div className="flex flex-row justify-between items-center gap-4 bg-veryLightGreyColor p-4 rounded-md border border-slate-200">
        <div className="text-right">
          <h2 className="text-gray-700 mb-1">البريد الإلكتروني</h2>
          <div className="flex items-center gap-2">
            <Image
              src={googleIcon}
              alt="Google"
              title="Google"
              className="w-4 h-4 bg-none"
              width={16}
              height={16}
            />
            <span className="underline text-sm">
              {currentUser?.email || "لا يوجد بريد إلكترونى"}{" "}
            </span>
          </div>
        </div>
      </div>

      {/* Full name section */}
      <div className="flex flex-row justify-between items-center gap-4 bg-veryLightGreyColor p-4 rounded-md border border-slate-200">
        <div className="text-right">
          <h2 className="text-gray-700 mb-1">الاسم الكامل</h2>
          <p className="underline text-sm">{currentUser?.name || "لا يوجد اسم كامل"}</p>
        </div>
        <Link href={`/users/${currentUser?.user_id}/settings`} className="text-sm underline">
          تعديل
        </Link>
      </div>
    </div>
  );
}
