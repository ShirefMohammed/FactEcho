"use client";

import dynamic from "next/dynamic";

const UserSettings = dynamic(() => import("../_components/UserSettings/UserSettings"), {
  ssr: false,
});

export default UserSettings;
